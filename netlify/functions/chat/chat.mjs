import { AgentsClient } from "@azure/ai-agents";
import { DefaultAzureCredential } from "@azure/identity";

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
    const { message, threadId: existingThreadId, password } = JSON.parse(event.body);

    const sitePassword = process.env.SITE_PASSWORD;
    if (sitePassword && password !== sitePassword) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Invalid password" }),
      };
    }

    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ error: "message is required" }) };
    }

    const agents = getClient();

    const threadId = existingThreadId || (await agents.threads.create()).id;

    await agents.messages.create(threadId, "user", message);

    const run = await agents.runs.createAndPoll(threadId, AGENT_ID);

    if (run.status === "failed") {
      throw new Error(`Run failed: ${JSON.stringify(run.lastError)}`);
    }

    let reply = "No response.";
    for await (const m of agents.messages.list(threadId)) {
      if (m.role === "assistant") {
        const textContent = m.content?.find((c) => c.type === "text");
        if (textContent) {
          reply = textContent.text.value;
        }
        break;
      }
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ reply, threadId }),
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
