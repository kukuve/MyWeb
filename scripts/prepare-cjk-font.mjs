/**
 * Prepares the CJK font bundled for server-side PDF generation.
 *
 * Pipeline:
 *   1. Instance the Noto Sans SC variable font at wght=400 (Regular) via
 *      fonttools — the VF's default instance is Thin (wght=100), which
 *      renders too light in PDF viewers.
 *   2. Write the full static font to lib/assets/NotoSansSC-Regular.ttf.
 *      The complete charset ships so newly added zh strings can never
 *      render as blank .notdef gaps; pdf-lib subsets it per PDF at save
 *      time, so downloads stay small.
 *
 * Run manually after updating the source variable font:
 *   node scripts/prepare-cjk-font.mjs [path-to-variable-font]
 *   (defaults to NotoSansSC-VF.tmp.ttf at the repo root)
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const sourcePath = path.resolve(
  process.cwd(),
  process.argv[2] ?? "NotoSansSC-VF.tmp.ttf",
);
if (!fs.existsSync(sourcePath)) {
  console.error(`Font source not found: ${sourcePath}`);
  console.error(
    "Usage: node scripts/prepare-cjk-font.mjs [path-to-variable-font]",
  );
  process.exit(1);
}

const outPath = path.join(
  process.cwd(),
  "lib",
  "assets",
  "NotoSansSC-Regular.ttf",
);

// Pin the variable font to Regular weight (wght=400).
execFileSync(
  "python",
  [
    "-m",
    "fontTools.varLib.instancer",
    sourcePath,
    "wght=400",
    "--update-name-table",
    "-o",
    outPath,
  ],
  { stdio: "inherit" },
);

const { size } = fs.statSync(outPath);
console.log(
  `Wrote ${outPath} (${(size / 1024 / 1024).toFixed(1)} MB). ` +
    "Run `npm run font:check` to verify glyph coverage.",
);
