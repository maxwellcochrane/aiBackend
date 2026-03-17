import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const xmlPath = path.join(__dirname, "FareRouteRestrictionsRefData_v1.2.xml");
  const xml = await readFile(xmlPath, "utf8");

  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
    textNodeName: "text",
  });

  const parsed = parser.parse(xml);

  const rawList =
    parsed?.FareRouteRestrictionsReferenceData?.FareRouteRestriction ??
    parsed?.FareRouteRestriction ??
    [];

  const list = Array.isArray(rawList) ? rawList : [rawList];

  const result = {};

  for (const fr of list) {
    if (!fr) continue;
    const code = fr.Code;
    if (!code) continue;

    const entry = {
      code,
      name: fr.Name ?? null,
      description: fr.Description ?? null,
      startDate: fr.StartDate ?? null,
      endDate: fr.EndDate ?? null,
      ojpDisplayName: fr.OJPDisplayName ?? null,
      rspDisplayName: fr.RSPDisplayName ?? null,
      enabledForMapPlotting: typeof fr.EnabledForMapPlotting === "string"
        ? fr.EnabledForMapPlotting.toLowerCase() === "true"
        : Boolean(fr.EnabledForMapPlotting),
    };

    result[code] = entry;
  }

  const outPath = path.join(__dirname, "fare-route-restrictions.json");
  await writeFile(outPath, JSON.stringify(result, null, 2), "utf8");
  console.log(
    `Wrote ${Object.keys(result).length} fare route restrictions to ${outPath}`
  );
}

main().catch((err) => {
  console.error("Conversion failed:", err);
  process.exit(1);
});

