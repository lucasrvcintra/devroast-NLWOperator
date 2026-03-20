# Roast Code Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full roast code analysis flow: submit code → AI analysis via Gemini → save to DB → display results page with real data.

**Architecture:** 
- Gemini API for code analysis with two modes (normal/roast)
- tRPC mutation to create roast, tRPC query to fetch results
- Instant navigation to results page with loading skeleton
- Existing Drizzle queries for DB operations

**Tech Stack:** Next.js 16, React 19, tRPC v11, Drizzle ORM, PostgreSQL, `@google/generative-ai`, Tailwind CSS v4

---

## File Structure

```
src/
├── lib/ai/
│   ├── client.ts          # NEW - Gemini client singleton
│   ├── prompts.ts         # NEW - System prompts (normal + roast)
│   └── analyzer.ts        # NEW - Response parsing + Zod schema
├── components/
│   ├── roast-result-skeleton.tsx  # NEW - Loading skeleton
│   └── skeleton.tsx       # MOD - Check if skeleton primitives exist
├── trpc/
│   └── routers/roast.ts   # MOD - Add create mutation + getById query
├── app/
│   └── roast/[id]/
│       ├── page.tsx       # MOD - Wrap with Suspense + prefetch
│       └── roast-result.tsx  # NEW - Client component for data
```

---

## Tasks

### Task 1: Install Gemini SDK

- [ ] **Step 1: Install `@google/generative-ai`**

```bash
npm install @google/generative-ai
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add @google/generative-ai for Gemini API"
```

---

### Task 2: Create AI Client

**Files:**
- Create: `src/lib/ai/client.ts`
- Test: Manual test with `console.log`

- [ ] **Step 1: Create `src/lib/ai/client.ts`**

```typescript
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
```

- [ ] **Step 2: Test client initialization (manual)**

Run `npm run dev` and check no errors on startup.

- [ ] **Step 3: Commit**

```bash
mkdir -p src/lib/ai && git add src/lib/ai/client.ts
git commit -m "feat(ai): add Gemini client setup"
```

---

### Task 3: Create AI Prompts

**Files:**
- Create: `src/lib/ai/prompts.ts`
- Reference: `src/lib/languages.ts` for language list

- [ ] **Step 1: Create `src/lib/ai/prompts.ts`**

```typescript
const NORMAL_PROMPT = `You are a professional code reviewer. Analyze the following {language} code and provide feedback.

Analyze the code and respond with ONLY valid JSON (no markdown, no code blocks):

{
  "score": <number 0-10>,
  "verdict": "needs_serious_help" | "rough_around_edges" | "decent_code" | "solid_work" | "exceptional",
  "quote": "<one sentence constructive feedback>",
  "analysis": [
    {
      "severity": "critical" | "warning" | "good",
      "title": "<short title>",
      "description": "<2 sentence explanation>"
    }
  ],
  "suggestedFix": [
    {"type": "context" | "removed" | "added", "content": "<line content>"}
  ]
}

Rules:
- Score 0-10 (0=terrible, 10=exceptional)
- Include 2-4 analysis items (mix of critical/warning/good)
- suggestedFix must be diff lines array showing old → new code
- Language: {language}`;

const ROAST_PROMPT = `You are a hilarious but helpful code roaster. Roast this {language} code with maximum sarcasm and humor, but still provide genuinely useful feedback.

Analyze the code and respond with ONLY valid JSON (no markdown, no code blocks):

{
  "score": <number 0-10>,
  "verdict": "needs_serious_help" | "rough_around_edges" | "decent_code" | "solid_work" | "exceptional",
  "quote": "<one sarcastic roast line>",
  "analysis": [
    {
      "severity": "critical" | "warning" | "good",
      "title": "<short sarcastic title>",
      "description": "<sarcastic but helpful 2 sentence explanation>"
    }
  ],
  "suggestedFix": [
    {"type": "context" | "removed" | "added", "content": "<line content>"}
  ]
}

Rules:
- Be maximally sarcastic and funny
- Score 0-10 (0=epic fail, 10=too good to roast)
- Include 2-4 analysis items
- suggestedFix must be diff lines array showing old → new code
- Language: {language}`;

export function getPrompt(language: string, roastMode: boolean): string {
  return (roastMode ? ROAST_PROMPT : NORMAL_PROMPT).replace(
    "{language}",
    language,
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/ai/prompts.ts
git commit -m "feat(ai): add system prompts for normal and roast mode"
```

---

### Task 4: Create AI Analyzer (Response Parsing)

**Files:**
- Create: `src/lib/ai/analyzer.ts`
- Reference: `src/lib/ai/prompts.ts` for prompt structure

- [ ] **Step 1: Create `src/lib/ai/analyzer.ts`**

```typescript
import { z } from "zod";

export const DiffLineSchema = z.object({
  type: z.enum(["context", "removed", "added"]),
  content: z.string(),
});

export const AnalysisItemSchema = z.object({
  severity: z.enum(["critical", "warning", "good"]),
  title: z.string(),
  description: z.string(),
});

export const RoastAnalysisSchema = z.object({
  score: z.number().min(0).max(10),
  verdict: z.enum([
    "needs_serious_help",
    "rough_around_edges",
    "decent_code",
    "solid_work",
    "exceptional",
  ]),
  quote: z.string(),
  analysis: z.array(AnalysisItemSchema),
  suggestedFix: z.array(DiffLineSchema),
});

export type RoastAnalysis = z.infer<typeof RoastAnalysisSchema>;

export function parseAnalysisResponse(text: string): RoastAnalysis {
  const cleaned = text.trim().replace(/```json\n?/g, "").replace(/```\n?$/g, "");
  
  try {
    const parsed = JSON.parse(cleaned);
    return RoastAnalysisSchema.parse(parsed);
  } catch {
    throw new Error("Failed to parse AI response as valid JSON");
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/ai/analyzer.ts
git commit -m "feat(ai): add response parsing with Zod schema"
```

---

### Task 5: Add tRPC Procedures

**Files:**
- Modify: `src/trpc/routers/roast.ts`
- Reference: `src/db/queries.ts`, `src/lib/ai/client.ts`, `src/lib/ai/prompts.ts`, `src/lib/ai/analyzer.ts`

- [ ] **Step 1: Read existing `src/trpc/routers/roast.ts`**

- [ ] **Step 2: Update `src/trpc/routers/roast.ts`**

```typescript
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, baseProcedure } from "../init";
import { createRoast, createAnalysisItems, getRoastWithAnalysis } from "@/db/queries";
import { generateContent } from "@/lib/ai/client";
import { getPrompt } from "@/lib/ai/prompts";
import { parseAnalysisResponse } from "@/lib/ai/analyzer";

export const roastRouter = createTRPCRouter({
  getById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await getRoastWithAnalysis(input.id);
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Roast not found",
        });
      }
      return result;
    }),

  create: baseProcedure
    .input(
      z.object({
        code: z.string().min(1).max(2000),
        language: z.string(),
        roastMode: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const prompt = getPrompt(input.language, input.roastMode);
      const fullPrompt = `${prompt}\n\nCODE:\n\`\`\`${input.language}\n${input.code}\n\`\`\``;

      let analysisResult;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          const response = await generateContent(fullPrompt, input.roastMode);
          analysisResult = parseAnalysisResponse(response);
          break;
        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to generate analysis after retries",
            });
          }
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
        }
      }

      const roast = await createRoast({
        code: input.code,
        language: input.language,
        lineCount: input.code.split("\n").length,
        roastMode: input.roastMode,
        score: analysisResult.score,
        verdict: analysisResult.verdict,
        roastQuote: analysisResult.quote,
        suggestedFix: JSON.stringify(analysisResult.suggestedFix),
      });

      await createAnalysisItems(
        roast.id,
        analysisResult.analysis.map((item, index) => ({
          ...item,
          order: index,
        })),
      );

      return { id: roast.id };
    }),
});
```

- [ ] **Step 3: Commit**

```bash
git add src/trpc/routers/roast.ts
git commit -m "feat(trpc): add roast.create mutation with Gemini AI integration"
```

---

### Task 6: Create Loading Skeleton

**Files:**
- Create: `src/components/roast-result-skeleton.tsx`
- Reference: `src/components/footer-stats-skeleton.tsx` for pattern

- [ ] **Step 1: Read existing skeleton for pattern reference**

```bash
cat src/components/footer-stats-skeleton.tsx
```

- [ ] **Step 2: Create `src/components/roast-result-skeleton.tsx`**

```typescript
export function RoastResultSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Score Hero Skeleton */}
      <div className="flex justify-center gap-12">
        <div className="w-32 h-32 rounded-full bg-muted" />
        <div className="flex flex-col gap-4 justify-center max-w-xl">
          <div className="h-4 w-48 bg-muted rounded" />
          <div className="h-8 w-full bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>

      {/* Code Block Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-48 bg-muted rounded-md border border-border" />
      </div>

      {/* Analysis Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-40 bg-muted rounded" />
        <div className="grid grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-md border border-border" />
          ))}
        </div>
      </div>

      {/* Suggested Fix Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-36 bg-muted rounded" />
        <div className="h-40 bg-muted rounded-md border border-border" />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/roast-result-skeleton.tsx
git commit -m "feat: add roast result loading skeleton"
```

---

### Task 7: Update Code Editor Wrapper

**Files:**
- Modify: `src/components/code-editor-wrapper.tsx`
- Reference: `src/trpc/routers/roast.ts`, `src/hooks/use-language-detection.ts`

- [ ] **Step 1: Update `src/components/code-editor-wrapper.tsx`**

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CodeEditor } from "@/components/code-editor";
import { useTRPC } from "@/trpc/client";
import type { LanguageId } from "@/lib/languages";
import { useLanguageDetection } from "@/hooks/use-language-detection";

export function CodeEditorWrapper() {
  const router = useRouter();
  const trpc = useTRPC();
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(false);

  const { detectedLanguage } = useLanguageDetection(code, true);
  const language: LanguageId = (detectedLanguage as LanguageId) ?? "javascript";

  const createMutation = useMutation(
    trpc.roast.create.mutationOptions({
      onSuccess: (data) => {
        router.push(`/roast/${data.id}`);
      },
      onError: (error) => {
        console.error("Failed to create roast:", error);
        alert("Failed to analyze code. Please try again.");
      },
    }),
  );

  const handleSubmit = () => {
    if (!code.trim()) return;
    createMutation.mutate({
      code,
      language,
      roastMode,
    });
  };

  return (
    <CodeEditor
      value={code}
      onChange={setCode}
      language={language}
      roastMode={roastMode}
      onRoastModeChange={setRoastMode}
      onSubmit={handleSubmit}
      isSubmitting={createMutation.isPending}
    />
  );
}
```

- [ ] **Step 2: Update `src/components/code-editor.tsx`**

Add `onSubmit` and `isSubmitting` props:

```typescript
interface CodeEditorProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  // ... existing props
  onSubmit?: () => void;
  isSubmitting?: boolean;
}
```

Update the button in Actions Bar:

```typescript
<Button
  variant="default"
  size="sm"
  disabled={!value || exceedsLimit || isSubmitting}
  onClick={onSubmit}
  className="font-mono text-sm"
>
  {isSubmitting ? (
    <span className="animate-spin">⟳</span>
  ) : (
    <span>$</span>
  )}
  <span>{isSubmitting ? "analyzing..." : "roast_my_code"}</span>
</Button>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/code-editor-wrapper.tsx src/components/code-editor.tsx
git commit -m "feat: connect code editor to roast.create mutation"
```

---

### Task 8: Update Roast Results Page

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`
- Create: `src/app/roast/[id]/roast-result.tsx`
- Create: `src/components/code-block-client.tsx` (wrapper for CodeBlock)
- Reference: `src/trpc/routers/roast.ts`, `src/components/roast-result-skeleton.tsx`, `src/components/ui/codeblock.tsx`

- [ ] **Step 1: Read `src/components/ui/codeblock.tsx` to understand structure**

- [ ] **Step 2: Create `src/components/code-block-client.tsx`**

```typescript
"use client";

import { useShikiHighlighter } from "@/hooks/use-shiki-highlighter";

interface CodeBlockClientProps {
  code: string;
  lang: string;
}

export function CodeBlockClient({ code, lang }: CodeBlockClientProps) {
  const { highlight, isReady } = useShikiHighlighter();
  
  if (!isReady) {
    return (
      <pre className="font-mono text-[12px] leading-[1.6] p-3 overflow-x-auto">
        {code}
      </pre>
    );
  }

  return (
    <pre
      className="font-mono text-[12px] leading-[1.6] p-3 overflow-x-auto [&_pre]:!bg-transparent [&_pre]:!m-0"
      dangerouslySetInnerHTML={{ __html: highlight(code, lang as any) }}
    />
  );
}
```

- [ ] **Step 3: Create `src/app/roast/[id]/roast-result.tsx`**

```typescript
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ScoreRing } from "@/components/ui/score-ring";
import { CodeBlockHeader } from "@/components/ui/codeblock";
import { CodeBlockClient } from "@/components/code-block-client";
import { DiffLine } from "@/components/ui/diff-line";

interface RoastResultProps {
  id: string;
}

export function RoastResult({ id }: RoastResultProps) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.roast.getById.queryOptions({ id }));

  const { roast, analysisItems } = data;

  const suggestedFix = roast.suggestedFix
    ? (JSON.parse(roast.suggestedFix) as Array<{
        type: "context" | "removed" | "added";
        content: string;
      }>)
    : [];

  const severityColors = {
    critical: "red",
    warning: "amber",
    good: "green",
  } as const;

  return (
    <div className="mx-auto max-w-[1440px] px-20 py-10">
      {/* Score Hero */}
      <div className="flex justify-center gap-12 mb-10">
        <ScoreRing score={roast.score} size="lg" />
        <div className="flex flex-col gap-4 justify-center max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="font-mono text-sm font-medium text-accent-red">
              verdict: {roast.verdict}
            </span>
          </div>
          <h1 className="font-mono text-xl leading-relaxed text-foreground">
            &quot;{roast.roastQuote}&quot;
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">
              lang: {roast.language}
            </span>
            <span className="font-mono text-xs text-muted-foreground">·</span>
            <span className="font-mono text-xs text-muted-foreground">
              {roast.lineCount} lines
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border mb-10" />

      {/* Submitted Code */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-foreground">
            your_submission
          </span>
        </div>
        <div className="border border-border rounded-md overflow-hidden">
          <CodeBlockHeader filename={`code.${roast.language}`} />
          <CodeBlockClient code={roast.code} lang={roast.language} />
        </div>
      </div>

      <div className="h-px bg-border mb-10" />

      {/* Analysis Section */}
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-foreground">
            detailed_analysis
          </span>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {analysisItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 p-5 border border-border rounded-md"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full bg-accent-${severityColors[item.severity]}`}
                />
                <span
                  className={`font-mono text-xs font-medium text-accent-${severityColors[item.severity]}`}
                >
                  {item.severity}
                </span>
              </div>
              <h3 className="font-mono text-sm font-medium text-foreground">
                {item.title}
              </h3>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-border mb-10" />

      {/* Suggested Fix */}
      {suggestedFix.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-accent-green">
              {"//"}
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              suggested_fix
            </span>
          </div>
          <div className="border border-border rounded-md overflow-hidden bg-bg-input">
            <div className="flex items-center h-10 px-4 border-b border-border">
              <span className="font-mono text-xs text-muted-foreground">
                your_code.{roast.language} → improved_code.{roast.language}
              </span>
            </div>
            <div className="flex flex-col">
              {suggestedFix.map((line, index) => (
                <DiffLine key={index} type={line.type}>
                  {line.content}
                </DiffLine>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update `src/app/roast/[id]/page.tsx`**

```typescript
import type { Metadata } from "next";
import { Suspense } from "react";
import { prefetch, trpc } from "@/trpc/server";
import { RoastResult } from "./roast-result";
import { RoastResultSkeleton } from "@/components/roast-result-skeleton";

export const metadata: Metadata = {
  title: "Roast Results | devroast",
  description: "Your code has been roasted",
};

export default async function RoastResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  void prefetch(trpc.roast.getById.queryOptions({ id }));

  return (
    <Suspense fallback={<RoastResultSkeleton />}>
      <RoastResult id={id} />
    </Suspense>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/roast/[id]/page.tsx src/app/roast/[id]/roast-result.tsx
git commit -m "feat: wire up roast results page with real data"
```

---

### Task 9: Run Lint and Typecheck

- [ ] **Step 1: Run Biome lint**

```bash
npm run lint
```

Fix any lint errors.

- [ ] **Step 2: Run TypeScript check**

```bash
npm run build
```

Fix any type errors.

- [ ] **Step 3: Commit fixes**

```bash
git add -A
git commit -m "fix: resolve lint and type errors"
```

---

### Task 10: Test Flow End-to-End

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test submission flow**

1. Go to homepage
2. Paste some code (e.g., `var x = 1;`)
3. Toggle roast mode on/off
4. Click "roast_my_code"
5. Verify redirect to `/roast/[id]`
6. Verify results display correctly

- [ ] **Step 3: Test error handling**

1. Submit invalid code
2. Verify error toast appears
3. Stay on editor page

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Install `@google/generative-ai` |
| 2 | Create `src/lib/ai/client.ts` |
| 3 | Create `src/lib/ai/prompts.ts` |
| 4 | Create `src/lib/ai/analyzer.ts` |
| 5 | Update tRPC router with `create` + `getById` |
| 6 | Create loading skeleton |
| 7 | Update code editor with mutation |
| 8 | Wire up results page |
| 9 | Lint + typecheck |
| 10 | E2E testing |
