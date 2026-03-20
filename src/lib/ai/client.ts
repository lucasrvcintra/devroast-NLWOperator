import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export async function generateContent(prompt: string, roastMode: boolean) {
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
