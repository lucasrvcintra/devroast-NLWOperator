"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { LeaderboardEntry } from "@/components/leaderboard-entry";
import { useTRPC } from "@/trpc/client";

export function LeaderboardList() {
  const trpc = useTRPC();
  const { data: entries } = useSuspenseQuery(
    trpc.roast.getLeaderboard.queryOptions({ limit: 20 }),
  );

  return (
    <div className="flex flex-col gap-5">
      {entries.map((entry, index) => (
        <LeaderboardEntry
          key={entry.id}
          rank={index + 1}
          score={entry.score}
          language={entry.language}
          lines={entry.lines}
          code={entry.code.split("\n")}
        />
      ))}
    </div>
  );
}
