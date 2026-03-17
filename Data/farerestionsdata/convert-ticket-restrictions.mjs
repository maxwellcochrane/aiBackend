import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function unwrapText(node) {
  if (node == null) return null;
  if (typeof node === "string") return node;
  if (typeof node.cdata === "string") return node.cdata;
  if (typeof node.text === "string") return node.text;
  if (typeof node["#text"] === "string") return node["#text"];
  return null;
}

function htmlToText(html) {
  if (!html) return null;
  let text = String(html);

  // Normalize common block boundaries to newlines
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n");
  text = text.replace(/<\/li>/gi, "\n");

  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, " ");

  // Collapse whitespace and blank lines
  text = text.replace(/\r\n/g, "\n");
  text = text.replace(/[ \t]+\n/g, "\n");
  text = text.replace(/\n{2,}/g, "\n");
  text = text.replace(/[ \t]+/g, " ");

  return text.trim();
}

async function main() {
  const xmlPath = path.join(__dirname, "raw.xml");
  const xml = await readFile(xmlPath, "utf8");

  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
    textNodeName: "text",
    cdataPropName: "cdata",
  });

  const parsed = parser.parse(xml);

  const ticketRestrictions =
    parsed?.TicketRestrictions?.TicketRestriction ??
    parsed?.TicketRestriction ??
    [];

  const list = Array.isArray(ticketRestrictions)
    ? ticketRestrictions
    : [ticketRestrictions];

  const result = {};

  for (const tr of list) {
    const code = tr.RestrictionCode;
    if (!code) continue;

    const name = unwrapText(tr.Name);
    const id = tr.TicketRestrictionIdentifier || null;
    const detailUrl = unwrapText(tr.LinkToDetailPage);

    const applicableDaysHtml = unwrapText(tr.ApplicableDays);
    const applicableDaysText = htmlToText(applicableDaysHtml);

    const notesHtml = unwrapText(tr.Notes);
    const notesText = htmlToText(notesHtml);

    const seasonalVariationsHtml = unwrapText(tr.SeasonalVariations);
    const seasonalVariationsText = htmlToText(seasonalVariationsHtml);

    const outwardDirection = unwrapText(tr.OutwardDirection);
    const returnDirection = unwrapText(tr.ReturnDirection);

    const restrictionsRaw =
      tr.Restrictions?.Restriction ?? tr.Restriction ?? [];
    const restrictionsList = Array.isArray(restrictionsRaw)
      ? restrictionsRaw
      : [restrictionsRaw];

    const restrictions = restrictionsList
      .map((r) => {
        if (!r) return null;
        const outwardHtml = unwrapText(r.DetailsOutward);
        const outwardText = htmlToText(outwardHtml);

        const returnHtml = unwrapText(r.DetailsReturn);
        const returnText = htmlToText(returnHtml);

        return {
          outwardHtml: outwardHtml || null,
          outwardText: outwardText || null,
          returnHtml: returnHtml || null,
          returnText: returnText || null,
        };
      })
      .filter(Boolean);

    result[code] = {
      code,
      name: name || null,
      id,
      detailUrl: detailUrl || null,
      applicableDaysHtml: applicableDaysHtml || null,
      applicableDaysText: applicableDaysText || null,
      notesHtml: notesHtml || null,
      notesText: notesText || null,
      seasonalVariationsHtml: seasonalVariationsHtml || null,
      seasonalVariationsText: seasonalVariationsText || null,
      outwardDirection: outwardDirection || null,
      returnDirection: returnDirection || null,
      restrictions,
      hasSeasonalVariations: Boolean(seasonalVariationsText),
      hasNotes: Boolean(notesText),
      hasOutwardRestrictions: restrictions.some((r) => r.outwardText),
      hasReturnRestrictions: restrictions.some((r) => r.returnText),
    };
  }

  const outPath = path.join(__dirname, "restrictions.json");
  await writeFile(outPath, JSON.stringify(result, null, 2), "utf8");
  console.log(
    `Wrote ${Object.keys(result).length} ticket restrictions to ${outPath}`
  );
}

main().catch((err) => {
  console.error("Conversion failed:", err);
  process.exit(1);
});

