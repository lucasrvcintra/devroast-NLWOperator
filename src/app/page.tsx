import { Suspense } from "react";
import { CodeEditorWrapper } from "@/components/code-editor-wrapper";
import { FooterStats } from "@/components/footer-stats";
import { FooterStatsSkeleton } from "@/components/footer-stats-skeleton";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { LeaderboardSkeleton } from "@/components/leaderboard-skeleton";

export default async function Home() {
  return (
    <div className="flex flex-col gap-8 py-20">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-4 text-center">
        <h1 className="flex items-center gap-3 font-mono text-4xl font-bold text-foreground">
          <span className="text-accent-green">&gt;</span>
          paste your code. get roasted.
        </h1>
        <p className="font-mono text-sm text-muted-foreground">
          {
            "// drop your code below and we'll rate it — brutally honest or full roast mode"
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
  );
}
