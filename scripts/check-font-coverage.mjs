/**
 * Verifies the bundled CJK font covers every character the zh PDF draws.
 *
 * pdf-lib silently renders characters that are missing from an embedded
 * font as .notdef — blank gaps in the final PDF. Run this after editing
 * any zh strings in lib/resume-data.ts.
 *
 * Usage:
 *   node scripts/check-font-coverage.mjs [path-to-font]
 *   (defaults to lib/assets/NotoSansSC-Regular.ttf)
 */
import fs from "node:fs";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { resumeData } from "../lib/resume-data.ts";

const SECTION_TITLES = ["Summary", "Experience", "Skills", "Projects", "Education"];

/** Mirror of every drawText() call in app/api/resume/route.ts for zh. */
function collectDrawnText() {
  const r = resumeData.zh;
  const text = [];

  text.push(r.name, r.role);
  text.push([r.email, r.location, ...r.socials.map((s) => s.label)].join("  ·  "));
  text.push(...SECTION_TITLES.map((t) => t.toUpperCase()));
  text.push(...r.about);
  for (const job of r.experience) {
    text.push(`${job.role} · ${job.company}`);
    text.push(job.period, job.location, job.summary, ...job.highlights);
  }
  for (const group of r.skills) {
    text.push(`${group.title}: `, ...group.skills, group.skills.join(" · "));
  }
  for (const project of r.projects) {
    text.push(project.title, project.tags.join(" · "), project.description);
  }
  for (const entry of r.education) {
    text.push(entry.degree, entry.period, entry.school);
  }
  text.push("•");

  return text.join("");
}

const fontPath = path.resolve(
  process.cwd(),
  process.argv[2] ?? "lib/assets/NotoSansSC-Regular.ttf",
);

const font = fontkit.create(fs.readFileSync(fontPath));
const chars = [...new Set(collectDrawnText())];
const missing = chars.filter(
  (c) => !font.hasGlyphForCodePoint(c.codePointAt(0)),
);

console.log(`Font: ${fontPath}`);
console.log(
  `  ${font.familyName} / ${font.subfamilyName} — ${font.numGlyphs} glyphs`,
);
console.log(`Drawn by zh PDF: ${chars.length} unique characters`);

if (missing.length > 0) {
  console.error(`MISSING ${missing.length} glyph(s): ${missing.join("")}`);
  console.error("Regenerate/extend the bundled font before shipping.");
  process.exit(1);
}

console.log("OK — every drawn character has a glyph (no blank gaps).");
