// SERVER-SIDE ONLY. Every file in src/lib/ai/ that imports this is only
// ever executed from an /api/*.ts route (Vercel serverless functions).
// Never import this module from src/pages or src/components — the API
// key must never end up in the client bundle.

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = 'gpt-5';

export class AiConfigError extends Error {}

function requireKey(): string {
  if (!OPENAI_API_KEY) {
    throw new AiConfigError('OPENAI_API_KEY is not set on the server.');
  }
  return OPENAI_API_KEY;
}

/**
 * Runs OpenAI's moderation endpoint against arbitrary user text.
 * Call this BEFORE any generation call on kid-authored input, and
 * again on AI-authored output before it can reach a public URL.
 */
export async function moderateText(text: string): Promise<boolean> {
  const key = requireKey();
  const res = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: text })
  });
  if (!res.ok) throw new Error(`Moderation call failed: ${await res.text()}`);
  const data = await res.json();
  return Boolean(data?.results?.[0]?.flagged);
}

/**
 * Calls the chat completion endpoint constrained to strict JSON output.
 * Every /lib/ai/* module uses this — the system prompt does the
 * behavioral work, this function just enforces the JSON contract and
 * surfaces parse failures clearly rather than returning malformed data
 * to a route handler.
 */
export async function callOpenAIJSON<T>(systemPrompt: string, userPayload: unknown): Promise<T> {
  const key = requireKey();
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(userPayload) }
      ]
    })
  });
  if (!res.ok) throw new Error(`AI service error: ${await res.text()}`);
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error('AI service returned an empty response.');
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error('AI service returned malformed JSON.');
  }
}
