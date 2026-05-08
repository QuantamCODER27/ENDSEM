/**
 * Helper for calling Hugging Face Inference API.
 * Normalizes responses to a shape compatible with the chatbot hook.
 */

const DEFAULT_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

export async function hfChat(payload) {
  const token = import.meta.env.VITE_HF_API_KEY;

  if (!token) {
    throw new Error("Hugging Face token not found. Ensure VITE_HF_API_KEY is set in .env");
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${DEFAULT_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HF request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // The Inference API often returns an array of objects like [{ generated_text: "..." }]
    // or a chat completion object with { choices: [...] }.
    // We normalize it to the OpenAI-style { choices: [{ message: { content: "..." } }] }.

    if (Array.isArray(data)) {
      return {
        choices: [
          {
            message: {
              role: "assistant",
              content: data[0]?.generated_text || "No response generated.",
            },
          },
        ],
      };
    }

    if (!data.choices && data.generated_text) {
      return {
        choices: [
          {
            message: {
              role: "assistant",
              content: data.generated_text,
            },
          },
        ],
      };
    }

    return data;
  } catch (error) {
    console.error("hfChat Error:", error);
    throw error;
  }
}
