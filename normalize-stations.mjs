import fs from "node:fs";

const inputPath = process.argv[2] ?? "Data/orderdetails.json";
const outputPath = process.argv[3] ?? "Data/orderdetails.stations.normalized.json";

function stripTrailingCommas(jsonLike) {
  // The source file looks like JSON but contains trailing commas before `}` / `]`.
  // This makes it parseable without changing the semantic structure.
  return jsonLike.replace(/,\s*([}\]])/g, "$1");
}

const raw = fs.readFileSync(inputPath, "utf8");
const fixed = stripTrailingCommas(raw);
const data = JSON.parse(fixed);

if (!data || typeof data !== "object" || !data.links || typeof data.links !== "object") {
  throw new Error(`Expected top-level object with a 'links' object in ${inputPath}`);
}

let stationCount = 0;
for (const [key, value] of Object.entries(data.links)) {
  if (!key.startsWith("/data/stations/")) continue;
  stationCount++;

  const station = value && typeof value === "object" ? value : {};
  data.links[key] = {
    name: station.name ?? null,
    nlc: station.nlc ?? null,
    crs: station.crs ?? null,
  };
}

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2) + "\n", "utf8");

console.log(`Normalized ${stationCount} station(s) to ${outputPath}`);

