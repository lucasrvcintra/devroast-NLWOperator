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
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: roastMode ? 1.0 : 0.3,
      maxOutputTokens: 2048,
      responseMimeType: "text/plain",
    },
  });

  return result.response.text();
}
