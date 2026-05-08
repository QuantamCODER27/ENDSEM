export async function openrouterChat(payload) {
  const token = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!token) {
    throw new Error(
      "OpenRouter API key not found. Set VITE_OPENROUTER_API_KEY in .env"
    );
  }

  // Ensure required fields are present; add sensible defaults if missing
  const body = {
    model: payload.model || "meta-llama/Meta-Llama-3-8B-Instruct",
    messages: payload.messages || [],
    // Optional parameters – adjust as needed
    max_tokens: payload.max_tokens || 250,
    temperature: payload.temperature || 0.7,
    // OpenRouter prefers a non‑streaming response for simple fetch
    stream: false,
    ...payload,
  };

  console.log("OpenRouter request payload:", JSON.stringify(body, null, 2));

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter request failed (${response.status}): ${err}`);
  }

  // OpenRouter follows the OpenAI response shape:
  // { choices: [{ message: { role, content } }, ...] }
  return response.json();
}
