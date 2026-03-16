import { avg, count, eq } from "drizzle-orm";
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
});
