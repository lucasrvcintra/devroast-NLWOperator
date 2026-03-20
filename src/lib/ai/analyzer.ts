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
  const cleaned = text
    .trim()
    .replace(/```json\n?/g, "")
    .replace(/```\n?$/g, "");

  try {
    const parsed = JSON.parse(cleaned);
    return RoastAnalysisSchema.parse(parsed);
  } catch {
    throw new Error("Failed to parse AI response as valid JSON");
  }
}
