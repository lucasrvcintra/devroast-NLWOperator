import { asc, eq, sql } from "drizzle-orm";
import { db } from "./index";
import { analysisItems, roasts } from "./schema";

export async function createRoast(data: {
  code: string;
  language: string;
  lineCount: number;
  roastMode?: boolean;
  score: number;
  verdict:
    | "needs_serious_help"
    | "rough_around_edges"
    | "decent_code"
    | "solid_work"
    | "exceptional";
  roastQuote?: string;
  suggestedFix?: string;
}) {
  const [roast] = await db
    .insert(roasts)
    .values({
      code: data.code,
      language: data.language,
      lineCount: data.lineCount,
      roastMode: data.roastMode ?? false,
      score: data.score,
      verdict: data.verdict,
      roastQuote: data.roastQuote ?? null,
      suggestedFix: data.suggestedFix ?? null,
    })
    .returning();

  return roast;
}

export async function createAnalysisItems(
  roastId: string,
  items: {
    severity: "critical" | "warning" | "good";
    title: string;
    description: string;
  }[],
) {
  if (items.length === 0) return [];

  const values = items.map((item, index) => ({
    roastId,
    severity: item.severity,
    title: item.title,
    description: item.description,
    order: index,
  }));

  const result = await db.insert(analysisItems).values(values).returning();
  return result;
}

export async function getRoastById(roastId: string) {
  const [roast] = await db.select().from(roasts).where(eq(roasts.id, roastId));

  return roast ?? null;
}

export async function getAnalysisItemsByRoastId(roastId: string) {
  return db
    .select()
    .from(analysisItems)
    .where(eq(analysisItems.roastId, roastId))
    .orderBy(asc(analysisItems.order));
}

export async function getRoastWithAnalysis(roastId: string) {
  const roast = await getRoastById(roastId);
  if (!roast) return null;

  const items = await getAnalysisItemsByRoastId(roastId);

  return {
    roast,
    analysisItems: items,
  };
}

export async function getLeaderboard(options?: {
  language?: string;
  limit?: number;
}) {
  const limit = options?.limit ?? 20;

  if (options?.language) {
    return db
      .select()
      .from(roasts)
      .where(eq(roasts.language, options.language))
      .orderBy(asc(roasts.score))
      .limit(limit);
  }

  return db.select().from(roasts).orderBy(asc(roasts.score)).limit(limit);
}

export async function getGlobalStats() {
  const [stats] = await db
    .select({
      totalRoasts: sql<number>`count(*)`,
      avgScore: sql<number>`coalesce(${roasts.score})`,
    })
    .from(roasts);

  return {
    totalRoasts: Number(stats.totalRoasts) || 0,
    avgScore: Number(stats.avgScore) || 0,
  };
}

export async function getLeaderboardByLanguage(language: string, limit = 20) {
  return db
    .select()
    .from(roasts)
    .where(eq(roasts.language, language))
    .orderBy(asc(roasts.score))
    .limit(limit);
}
