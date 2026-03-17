import { asc, avg, count } from "drizzle-orm";
import { z } from "zod";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const roastRouter = createTRPCRouter({
  getStats: baseProcedure.query(async ({ ctx }) => {
    const [stats] = await ctx.db
      .select({
        totalRoasts: count(),
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
          limit: z.number().min(1).max(100).default(3),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 3;

      const entries = await ctx.db
        .select({
          id: roasts.id,
          code: roasts.code,
          language: roasts.language,
          score: roasts.score,
        })
        .from(roasts)
        .orderBy(asc(roasts.score))
        .limit(limit);

      return entries;
    }),
});
