import type { Metadata } from "next";
import { Suspense } from "react";
import { LeaderboardList } from "@/components/leaderboard-list";
import { LeaderboardSkeleton } from "@/components/leaderboard-skeleton";
import { LeaderboardStats } from "@/components/leaderboard-stats";
import { LeaderboardStatsSkeleton } from "@/components/leaderboard-stats-skeleton";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "shame_leaderboard | devroast",
  description: "The most roasted code on the internet",
};

export default async function LeaderboardPage() {
  void prefetch(trpc.roast.getLeaderboard.queryOptions({ limit: 20 }));
  void prefetch(trpc.roast.getStats.queryOptions());

  return (
    <HydrateClient>
      <div className="mx-auto max-w-[1440px] px-20 py-10">
        <div className="mb-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[32px] font-bold text-accent-green">
              &gt;
            </span>
            <h1 className="font-mono text-[28px] font-bold text-foreground">
              shame_leaderboard
            </h1>
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            {"// the most roasted code on the internet"}
          </p>
          <Suspense fallback={<LeaderboardStatsSkeleton />}>
            <LeaderboardStats />
          </Suspense>
        </div>

        <Suspense fallback={<LeaderboardSkeleton />}>
          <LeaderboardList />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
