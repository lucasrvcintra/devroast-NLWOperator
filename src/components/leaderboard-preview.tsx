"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import type { BundledLanguage } from "shiki";
import { Card } from "@/components/ui/card";
import { CollapsibleCodeBlock } from "@/components/ui/collapsible-code-block";
import {
  CodeCell,
  RankCell,
  ScoreCell,
  TableCell,
  TableRow,
} from "@/components/ui/table-row";
import { useTRPC } from "@/trpc/client";

export function LeaderboardPreview() {
  const trpc = useTRPC();

  const leaderboardQuery = useSuspenseQuery(
    trpc.roast.getLeaderboard.queryOptions(),
  );
  const statsQuery = useSuspenseQuery(trpc.roast.getStats.queryOptions());

  const isLoading = leaderboardQuery.isLoading || statsQuery.isLoading;

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  const data = leaderboardQuery.data;
  const stats = statsQuery.data;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg font-semibold text-foreground">
          leaderboard
        </h2>
        <Link
          href="/leaderboard"
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          view all &gt;&gt;
        </Link>
      </div>
      <p className="font-mono text-xs text-muted-foreground">
        {"// the worst code on the internet, ranked by shame"}
      </p>

      <Card>
        <div className="flex items-center border-b border-border bg-bg-surface px-5 py-2.5">
          <TableCell width={40}>
            <span className="font-mono text-[12px] text-muted-foreground font-semibold">
              #
            </span>
          </TableCell>
          <TableCell width={60}>
            <span className="font-mono text-[12px] text-muted-foreground font-semibold">
              score
            </span>
          </TableCell>
          <TableCell grow>
            <span className="font-mono text-[12px] text-muted-foreground font-semibold">
              code
            </span>
          </TableCell>
        </div>
        {data.map((item, index) => (
          <TableRow key={item.id}>
            <RankCell>#{index + 1}</RankCell>
            <ScoreCell score={item.score} />
            <CodeCell>
              <CollapsibleCodeBlock
                code={item.code}
                lang={item.language as BundledLanguage}
                isCollapsed={true}
              />
            </CodeCell>
          </TableRow>
        ))}
      </Card>

      <p className="text-center font-mono text-xs text-muted-foreground pt-4">
        showing top 3 of {stats.totalRoasts} ·{" "}
        <Link
          href="/leaderboard"
          className="hover:text-foreground transition-colors"
        >
          view full leaderboard
        </Link>{" "}
        &gt;&gt;
      </p>
    </section>
  );
}

function LeaderboardSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-4 w-72 animate-pulse rounded bg-muted" />

      <Card>
        <div className="flex items-center border-b border-border bg-bg-surface px-5 py-2.5">
          <div className="w-10">
            <div className="h-4 w-4 animate-pulse rounded bg-muted" />
          </div>
          <div className="w-[60px]">
            <div className="h-4 w-8 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex-1">
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border px-5 py-4"
          >
            <div className="w-10">
              <div className="h-4 w-5 animate-pulse rounded bg-muted" />
            </div>
            <div className="w-[60px]">
              <div className="h-4 w-8 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex-1">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
}
