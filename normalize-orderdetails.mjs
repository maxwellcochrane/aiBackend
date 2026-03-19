import fs from "node:fs";

const inputPath = process.argv[2] ?? "Data/orderdetails.json";
const outputPath = process.argv[3] ?? "Data/orderdetails.normalized.json";

function stripTrailingCommas(jsonLike) {
  // The source file looks like JSON but contains trailing commas before `}` / `]`.
  // This makes it parseable without changing the semantic structure.
  return jsonLike.replace(/,\s*([}\]])/g, "$1");
}

const raw = fs.readFileSync(inputPath, "utf8");
const fixed = stripTrailingCommas(raw);
const data = JSON.parse(fixed);

if (!data || !Array.isArray(data.result)) {
  throw new Error(`Expected top-level object with a 'result' array in ${inputPath}`);
}

const normalized = data.result.map((item) => {
  const delivery = item?.delivery && typeof item.delivery === "object" ? item.delivery : {};

  return {
    delivery: {
      displayName: delivery.displayName ?? null,
      collectionStartDate: delivery.collectionStartDate ?? null,
    },
    collectionReference: item?.collectionReference ?? null,
    email: item?.email ?? null,
    totalPrice: item?.totalPrice ?? null,
    state: item?.state ?? null,
    purchaseDate: item?.purchaseDate ?? null,
    trips: Array.isArray(item?.trips) ? item.trips : [],
    refundCanBeAttemptedOnline: item?.refundCanBeAttemptedOnline ?? false,
    refundCanBeAttemptedOffline: item?.refundCanBeAttemptedOffline ?? false,
  };
});

const output = {
  ...data,
  result: normalized,
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n", "utf8");

console.log(
  `Wrote ${normalized.length} normalized result(s) to ${outputPath}`
);

