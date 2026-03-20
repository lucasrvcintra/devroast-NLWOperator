# AI Provider Fallback Implementation Plan

> **For agentic workers:** Execute tasks directly without committing unless explicitly asked.

**Goal:** Implement fallback between Gemini and OpenAI APIs when one fails.

**Architecture:** Try Gemini first → fallback to OpenAI → throw error if both fail

---

## Tasks

### Task 1: Extract Gemini to separate module

Create `src/lib/ai/gemini.ts`:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callGemini(prompt: string, roastMode: boolean): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
```

### Task 2: Create OpenAI provider

Create `src/lib/ai/openai.ts`:

```typescript
export async function callOpenAI(prompt: string, roastMode: boolean): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: roastMode ? 1.0 : 0.3,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content ?? "";
}
```

### Task 3: Update client.ts with fallback

Replace content of `src/lib/ai/client.ts`:

```typescript
import { callGemini } from "./gemini";
import { callOpenAI } from "./openai";

export async function generateContent(prompt: string, roastMode: boolean): Promise<string> {
  const errors: string[] = [];

  // Try Gemini first
  if (process.env.GEMINI_API_KEY) {
    try {
      return await callGemini(prompt, roastMode);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      
      // Auth errors - don't fallback, key is invalid
      if (message.includes("401") || message.includes("403") || message.includes("API_KEY_INVALID")) {
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
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Extract Gemini logic to `gemini.ts` |
| 2 | Create `openai.ts` with OpenAI API call |
| 3 | Update `client.ts` with fallback logic |
