import fs from "node:fs";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import {
  resumeData,
  RESUME_FILE_NAME,
  type Language,
  type ResumeData,
} from "@/lib/resume-data";

export const runtime = "nodejs";

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89; // A4
const MARGIN_X = 52;
const MARGIN_TOP = 56;
const MARGIN_BOTTOM = 52;

const COLORS = {
  text: rgb(0.12, 0.13, 0.16),
  muted: rgb(0.42, 0.44, 0.5),
  accent: rgb(0.42, 0.27, 0.79),
  rule: rgb(0.88, 0.88, 0.9),
};

const FILENAME = RESUME_FILE_NAME;

// Full Noto Sans SC (OFL) bundled with the repo — the complete CJK charset
// ships so any zh string renders, even after content edits. pdf-lib re-subsets
// the font at save time, so the output PDF stays compact. Regenerate via:
//   node scripts/prepare-cjk-font.mjs <path-to-variable-font>
const CJK_FONT_PATH = path.join(
  process.cwd(),
  "lib",
  "assets",
  "NotoSansSC-Regular.ttf",
);

let cachedCjkFontBytes: Uint8Array | null = null;

function readCjkFont(): Uint8Array {
  if (!cachedCjkFontBytes) {
    cachedCjkFontBytes = new Uint8Array(fs.readFileSync(CJK_FONT_PATH));
  }
  return cachedCjkFontBytes;
}

type Fonts = {
  regular: PDFFont;
  bold: PDFFont;
};

/** Wrap text into lines that fit within maxWidth at the given size. */
function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    // CJK runs have no spaces — a single "word" may exceed maxWidth.
    // Break such runs greedily by character so lines never overflow.
    if (font.widthOfTextAtSize(word, size) > maxWidth) {
      if (line) {
        lines.push(line);
        line = "";
      }
      let chunk = "";
      for (const ch of word) {
        const candidate = chunk + ch;
        if (font.widthOfTextAtSize(candidate, size) > maxWidth) {
          if (chunk) lines.push(chunk);
          chunk = ch;
        } else {
          chunk = candidate;
        }
      }
      line = chunk;
      continue;
    }

    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawSectionTitle(
  page: PDFPage,
  fonts: Fonts,
  title: string,
  y: number,
) {
  page.drawRectangle({
    x: MARGIN_X,
    y: y - 2.5,
    width: 14,
    height: 2.5,
    color: COLORS.accent,
  });
  page.drawText(title.toUpperCase(), {
    x: MARGIN_X + 20,
    y: y - 7,
    size: 10,
    font: fonts.bold,
    color: COLORS.accent,
  });
}

function drawRule(page: PDFPage, y: number) {
  page.drawLine({
    start: { x: MARGIN_X, y },
    end: { x: PAGE_WIDTH - MARGIN_X, y },
    thickness: 0.75,
    color: COLORS.rule,
  });
}

/**
 * Draw short right-aligned meta text (a period, tags…) beside a left text of
 * the given width when both fit on one line; otherwise stack it on its own
 * line below. Returns the extra vertical space consumed (0 or 13).
 */
function drawRightAlignedMeta(
  page: PDFPage,
  fonts: Fonts,
  meta: string,
  metaSize: number,
  leftWidth: number,
  y: number,
): number {
  const metaWidth = fonts.regular.widthOfTextAtSize(meta, metaSize);
  if (leftWidth + metaWidth + 12 <= PAGE_WIDTH - MARGIN_X * 2) {
    page.drawText(meta, {
      x: PAGE_WIDTH - MARGIN_X - metaWidth,
      y,
      size: metaSize,
      font: fonts.regular,
      color: COLORS.muted,
    });
    return 0;
  }
  // Stacked fallback — never overlap the left text.
  page.drawText(meta, {
    x: MARGIN_X,
    y: y - 13,
    size: metaSize,
    font: fonts.regular,
    color: COLORS.muted,
  });
  return 13;
}

async function loadFonts(
  doc: PDFDocument,
  language: Language,
): Promise<Fonts> {
  if (language === "zh") {
    // Chinese text needs the bundled CJK font; the full charset is embedded
    // and pdf-lib subsets it per PDF on save. No bold variant — section
    // titles use size + accent color for hierarchy instead.
    const regular = await doc.embedFont(readCjkFont(), { subset: true });
    return { regular, bold: regular };
  }

  return {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language: Language = searchParams.get("lang") === "zh" ? "zh" : "en";
  const resume: ResumeData = resumeData[language];

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const fonts: Fonts = await loadFonts(doc, language);

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN_TOP;
  const contentWidth = PAGE_WIDTH - MARGIN_X * 2;

  /** Ensure enough vertical space, adding a new page when needed. */
  const ensureSpace = (needed: number) => {
    if (y - needed < MARGIN_BOTTOM) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN_TOP;
    }
  };

  // ---- Header -----------------------------------------------------------
  page.drawText(resume.name, {
    x: MARGIN_X,
    y,
    size: 26,
    font: fonts.bold,
    color: COLORS.text,
  });
  y -= 22;

  page.drawText(resume.role, {
    x: MARGIN_X,
    y,
    size: 11,
    font: fonts.bold,
    color: COLORS.accent,
  });
  y -= 17;

  const contactLine = [resume.email, resume.location, ...resume.socials.map((s) => s.label)].join(
    "  ·  ",
  );
  page.drawText(contactLine, {
    x: MARGIN_X,
    y,
    size: 8,
    font: fonts.regular,
    color: COLORS.muted,
  });
  y -= 20;
  drawRule(page, y);
  y -= 18;

  // ---- Summary -----------------------------------------------------------
  ensureSpace(46);
  drawSectionTitle(page, fonts, "Summary", y);
  y -= 20;
  for (const paragraph of resume.about) {
    const lines = wrapText(paragraph, fonts.regular, 9.5, contentWidth);
    for (const line of lines) {
      ensureSpace(13);
      page.drawText(line, {
        x: MARGIN_X,
        y,
        size: 9.5,
        font: fonts.regular,
        color: COLORS.text,
      });
      y -= 13;
    }
    y -= 4;
  }
  y -= 8;

  // ---- Experience --------------------------------------------------------
  ensureSpace(40);
  drawSectionTitle(page, fonts, "Experience", y);
  y -= 22;

  for (const job of resume.experience) {
    ensureSpace(90);
    const roleText = `${job.role} · ${job.company}`;
    const roleWidth = fonts.bold.widthOfTextAtSize(roleText, 11);
    page.drawText(roleText, {
      x: MARGIN_X,
      y,
      size: 11,
      font: fonts.bold,
      color: COLORS.text,
    });
    y -= 13 + drawRightAlignedMeta(page, fonts, job.period, 8.5, roleWidth, y);

    page.drawText(`${job.location}`, {
      x: MARGIN_X,
      y,
      size: 8.5,
      font: fonts.regular,
      color: COLORS.accent,
    });
    y -= 14;

    for (const line of wrapText(job.summary, fonts.regular, 9, contentWidth)) {
      ensureSpace(12);
      page.drawText(line, {
        x: MARGIN_X,
        y,
        size: 9,
        font: fonts.regular,
        color: COLORS.muted,
      });
      y -= 12;
    }
    y -= 3;

    for (const highlight of job.highlights) {
      const lines = wrapText(highlight, fonts.regular, 9, contentWidth - 12);
      lines.forEach((line, index) => {
        ensureSpace(12);
        if (index === 0) {
          page.drawText("•", {
            x: MARGIN_X + 2,
            y,
            size: 9,
            font: fonts.regular,
            color: COLORS.accent,
          });
        }
        page.drawText(line, {
          x: MARGIN_X + 12,
          y,
          size: 9,
          font: fonts.regular,
          color: COLORS.text,
        });
        y -= 12;
      });
    }
    y -= 12;
  }

  // ---- Skills -------------------------------------------------------------
  ensureSpace(46);
  drawSectionTitle(page, fonts, "Skills", y);
  y -= 18;
  for (const group of resume.skills) {
    ensureSpace(26);
    const label = `${group.title}: `;
    page.drawText(label, {
      x: MARGIN_X,
      y,
      size: 9.5,
      font: fonts.bold,
      color: COLORS.text,
    });
    const labelWidth = fonts.bold.widthOfTextAtSize(label, 9.5);
    const body = group.skills.join(" · ");
    for (const line of wrapText(body, fonts.regular, 9.5, contentWidth - labelWidth)) {
      ensureSpace(13);
      page.drawText(line, {
        x: MARGIN_X + labelWidth,
        y,
        size: 9.5,
        font: fonts.regular,
        color: COLORS.muted,
      });
      y -= 13;
    }
    y -= 2;
  }
  y -= 10;

  // ---- Projects ------------------------------------------------------------
  ensureSpace(50);
  drawSectionTitle(page, fonts, "Projects", y);
  y -= 22;
  for (const project of resume.projects) {
    ensureSpace(54);
    for (const line of wrapText(project.title, fonts.bold, 10, contentWidth)) {
      ensureSpace(12);
      page.drawText(line, {
        x: MARGIN_X,
        y,
        size: 10,
        font: fonts.bold,
        color: COLORS.text,
      });
      y -= 12;
    }
    y -= 2;
    // Stacked layout: the tag list sits on its own line below the title.
    // Same-line right alignment has no flex layout in a PDF — long titles
    // and long tag lists would physically overlap.
    for (const line of wrapText(
      project.tags.join(" · "),
      fonts.regular,
      7.5,
      contentWidth,
    )) {
      ensureSpace(10);
      page.drawText(line, {
        x: MARGIN_X,
        y,
        size: 7.5,
        font: fonts.regular,
        color: COLORS.accent,
      });
      y -= 10;
    }
    y -= 3;
    for (const line of wrapText(project.description, fonts.regular, 9, contentWidth)) {
      ensureSpace(12);
      page.drawText(line, {
        x: MARGIN_X,
        y,
        size: 9,
        font: fonts.regular,
        color: COLORS.muted,
      });
      y -= 12;
    }
    y -= 8;
  }

  // ---- Education -----------------------------------------------------------
  ensureSpace(40);
  drawSectionTitle(page, fonts, "Education", y);
  y -= 20;
  for (const entry of resume.education) {
    ensureSpace(45);
    const degreeWidth = fonts.bold.widthOfTextAtSize(entry.degree, 10);
    page.drawText(entry.degree, {
      x: MARGIN_X,
      y,
      size: 10,
      font: fonts.bold,
      color: COLORS.text,
    });
    y -= 13 + drawRightAlignedMeta(page, fonts, entry.period, 8.5, degreeWidth, y);
    page.drawText(entry.school, {
      x: MARGIN_X,
      y,
      size: 9,
      font: fonts.regular,
      color: COLORS.muted,
    });
    y -= 16;
  }

  const pdfBytes = await doc.save();

  return new Response(new Uint8Array(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${FILENAME}"`,
      "Cache-Control": "no-store",
    },
  });
}
