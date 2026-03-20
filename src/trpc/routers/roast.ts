import { TRPCError } from "@trpc/server";
import { asc, avg, count } from "drizzle-orm";
import { z } from "zod";
import {
  createAnalysisItems,
  createRoast,
  getRoastWithAnalysis,
} from "@/db/queries";
import { roasts } from "@/db/schema";
import { parseAnalysisResponse } from "@/lib/ai/analyzer";
import { generateContent } from "@/lib/ai/client";
import { getPrompt } from "@/lib/ai/prompts";
import { baseProcedure, createTRPCRouter } from "../init";

export const roastRouter = createTRPCRouter({
  getStats: baseProcedure.query(async ({ ctx }) => {
    const [stats] = await ctx.db
      .select({
        totalRoasts: count(roasts.id),
        avgScore: avg(roasts.score),
      })
      .from(roasts);

    return {
      totalRoasts: stats?.totalRoasts ?? 0,
      avgScore: Number(stats?.avgScore) ?? 0,
    };
  }),

  getLeaderboard: baseProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(20),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;

      const entries = await ctx.db
        .select({
          id: roasts.id,
          code: roasts.code,
          language: roasts.language,
          score: roasts.score,
          lines: roasts.lineCount,
        })
        .from(roasts)
        .orderBy(asc(roasts.score))
        .limit(limit);

      return entries;
    }),

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

      let analysisResult: ReturnType<typeof parseAnalysisResponse> | undefined;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          const response = await generateContent(fullPrompt, input.roastMode);
          analysisResult = parseAnalysisResponse(response);
          break;
        } catch {
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

      if (!analysisResult) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate analysis",
        });
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
