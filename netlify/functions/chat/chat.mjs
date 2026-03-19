import { AgentsClient } from "@azure/ai-agents";
import { DefaultAzureCredential } from "@azure/identity";
import { LINK_CONFIG } from "./linkConfig.mjs";

const PROJECT_ENDPOINT =
  process.env.AZURE_PROJECT_ENDPOINT ||
  "https://echo80.services.ai.azure.com/api/projects/echo80";
const AGENT_ID =
  process.env.AZURE_AGENT_ID || "asst_ZemN9WHm83PGXCGYBBxcQdgr";

let client;
function getClient() {
  if (!client) {
    client = new AgentsClient(PROJECT_ENDPOINT, new DefaultAzureCredential());
  }
  return client;
}

function extractLinks(text) {
  const pattern = /\[LINK:([\w-]+)\]/g;
  const links = [];
  const seen = new Set();
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const id = match[1];
    if (LINK_CONFIG[id] && !seen.has(id)) {
      seen.add(id);
      links.push({ id, ...LINK_CONFIG[id] });
    }
  }
  const cleanedText = text
    .replace(pattern, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { cleanedText, links };
}

function isJourneyCard(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.title === "string" &&
    value.times &&
    typeof value.times === "object" &&
    value.duration &&
    typeof value.duration === "object"
  );
}

function isJourneyCardArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isJourneyCard);
}

function extractJourneyCards(text) {
  const candidates = [];

  const fencedJsonPattern = /```json\s*([\s\S]*?)```/gi;
  let fencedMatch;
  while ((fencedMatch = fencedJsonPattern.exec(text)) !== null) {
    candidates.push({ raw: fencedMatch[0], json: fencedMatch[1].trim() });
  }

  const firstArray = text.indexOf("[");
  const lastArray = text.lastIndexOf("]");
  if (firstArray !== -1 && lastArray > firstArray) {
    const raw = text.slice(firstArray, lastArray + 1);
    candidates.push({ raw, json: raw.trim() });
  }

  const firstObject = text.indexOf("{");
  const lastObject = text.lastIndexOf("}");
  if (firstObject !== -1 && lastObject > firstObject) {
    const raw = text.slice(firstObject, lastObject + 1);
    candidates.push({ raw, json: raw.trim() });
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate.json);
      if (isJourneyCardArray(parsed)) {
        const cleanedText = text
          .replace(candidate.raw, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        return { cleanedText, journeyCards: parsed };
      }

      if (isJourneyCardArray(parsed?.journey_cards)) {
        const cleanedText = text
          .replace(candidate.raw, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        return { cleanedText, journeyCards: parsed.journey_cards };
      }
    } catch {
      // Not valid JSON; ignore and continue.
    }
  }

  return { cleanedText: text, journeyCards: [] };
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { message, threadId: existingThreadId, password, verifyOnly } = JSON.parse(event.body);

    const sitePassword = process.env.SITE_PASSWORD;
    if (sitePassword && password !== sitePassword) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Invalid password" }),
      };
    }

    if (verifyOnly) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ ok: true }),
      };
    }

    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ error: "message is required" }) };
    }

    const agents = getClient();

    const threadId = existingThreadId || (await agents.threads.create()).id;
    
    const now = new Date();
    const dateContext = `[CURRENT_DATETIME: ${now.toISOString()} | TIMEZONE: Europe/London]`;
    await agents.messages.create(threadId, "user", `${dateContext}\n\n${message}`);

    const run = await agents.runs.createAndPoll(threadId, AGENT_ID);

    if (run.status === "failed") {
      throw new Error(`Run failed: ${JSON.stringify(run.lastError)}`);
    }

    let rawReply = "No response.";
    for await (const m of agents.messages.list(threadId)) {
      if (m.role === "assistant") {
        const textContent = m.content?.find((c) => c.type === "text");
        if (textContent) {
          rawReply = textContent.text.value;
        }
        break;
      }
    }

    const { cleanedText: withoutLinks, links } = extractLinks(rawReply);
    const { cleanedText: reply, journeyCards } = extractJourneyCards(withoutLinks);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        reply,
        threadId,
        links,
        journeyCards,
        ui: journeyCards.length ? { type: "journey_cards", data: journeyCards } : null,
      }),
    };
  } catch (err) {
    console.error("Chat function error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
