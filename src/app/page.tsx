import { Suspense } from "react";
import { CodeEditorWrapper } from "@/components/code-editor-wrapper";
import { FooterStats } from "@/components/footer-stats";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function Home() {
  void prefetch(trpc.roast.getStats.queryOptions());
  void prefetch(trpc.roast.getLeaderboard.queryOptions());

  return (
    <HydrateClient>
      <div className="flex flex-col gap-8 py-20">
        {/* Hero Section */}
        <section className="flex flex-col items-center gap-4 text-center">
          <h1 className="flex items-center gap-3 font-mono text-4xl font-bold text-foreground">
            <span className="text-accent-green">&gt;</span>
            paste your code. get roasted.
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            {
              "// drop your code below and we&apos;ll rate it — brutally honest or full roast mode"
            }
          </p>
        </section>

        {/* Code Input Area */}
        <CodeEditorWrapper />

        {/* Footer Stats */}
        <Suspense fallback={<FooterStatsSkeleton />}>
          <FooterStats />
        </Suspense>

        {/* Spacer */}
        <div className="h-16" />

        {/* Leaderboard Preview */}
        <Suspense fallback={<LeaderboardSkeleton />}>
          <LeaderboardPreview />
        </Suspense>
      </div>
    </HydrateClient>
  );
}

function FooterStatsSkeleton() {
  return (
    <section className="flex items-center justify-center gap-6">
      <span className="font-mono text-xs text-muted-foreground">
        <span className="inline-block w-16 animate-pulse rounded bg-muted">
          &nbsp;
        </span>{" "}
        codes roasted
      </span>
      <span className="text-muted-foreground">·</span>
      <span className="font-mono text-xs text-muted-foreground">
        avg score:{" "}
        <span className="inline-block w-8 animate-pulse rounded bg-muted">
          &nbsp;
        </span>
        /10
      </span>
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

      <div className="flex flex-col border border-border">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border px-5 py-4"
          >
            <div className="h-4 w-8 animate-pulse rounded bg-muted" />
            <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      <p className="text-center font-mono text-xs text-muted-foreground pt-4">
        <span className="inline-block w-20 animate-pulse rounded bg-muted">
          &nbsp;
        </span>
      </p>
    </section>
  );
}
