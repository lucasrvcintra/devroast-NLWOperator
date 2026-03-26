import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callGemini(
  prompt: string,
  roastMode: boolean,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const result = await Promise.race([
    model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: roastMode ? 1.0 : 0.3,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout after 10s")), 10000),
    ),
  ]);

  return result.response.text();
}
