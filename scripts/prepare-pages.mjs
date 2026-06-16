import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve("dist-pages");
const indexHtml = resolve(distDir, "index.html");
const fallbackHtml = resolve(distDir, "404.html");

if (!existsSync(indexHtml)) {
  throw new Error("dist-pages/index.html was not created. Run the Pages build first.");
}

copyFileSync(indexHtml, fallbackHtml);
writeFileSync(resolve(distDir, ".nojekyll"), "");
