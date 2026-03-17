import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const srcPath = path.join(__dirname, "restrictions.json");
  const outDir = path.join(__dirname, "restrictions-batches");
  const batchSize = 20;

  const raw = await readFile(srcPath, "utf8");
  const all = JSON.parse(raw);

  await mkdir(outDir, { recursive: true });

  const codes = Object.keys(all).sort();

  let batchIndex = 0;
  for (let i = 0; i < codes.length; i += batchSize) {
    const batchCodes = codes.slice(i, i + batchSize);
    const batch = {};
    for (const code of batchCodes) {
      const data = all[code];
      if (!data) continue;
      batch[code] = data;
    }

    const fileName = `restrictions-batch-${batchIndex + 1}.json`;
    const outPath = path.join(outDir, fileName);
    await writeFile(outPath, JSON.stringify(batch, null, 2), "utf8");
    batchIndex += 1;
  }

  console.log(
    `Wrote ${batchIndex} batch files to ${path.relative(process.cwd(), outDir)}`
  );
}

main().catch((err) => {
  console.error("Split failed:", err);
  process.exit(1);
});

