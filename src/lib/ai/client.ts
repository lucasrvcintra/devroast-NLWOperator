import { callGemini } from "./gemini";
import { callOpenAI } from "./openai";

export async function generateContent(
  prompt: string,
  roastMode: boolean,
): Promise<string> {
  const errors: string[] = [];

  // Try Gemini first
  if (process.env.GEMINI_API_KEY) {
    try {
      return await callGemini(prompt, roastMode);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      // Auth errors - don't fallback, key is invalid
      if (
        message.includes("401") ||
        message.includes("403") ||
        message.includes("API_KEY_INVALID")
      ) {
        throw error;
      }

      errors.push(`Gemini: ${message}`);
    }
  }

  // Try OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      return await callOpenAI(prompt, roastMode);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      // Auth errors - don't fallback
      if (message.includes("401") || message.includes("403")) {
        throw error;
      }

      errors.push(`OpenAI: ${message}`);
    }
  }

  // No providers available or all failed
  throw new Error(`All AI providers failed: ${errors.join("; ")}`);
}
