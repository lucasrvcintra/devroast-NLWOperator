import { Suspense } from "react";
import { CodeEditorWrapper } from "@/components/code-editor-wrapper";
import { FooterStats } from "@/components/footer-stats";
import { FooterStatsSkeleton } from "@/components/footer-stats-skeleton";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { LeaderboardSkeleton } from "@/components/leaderboard-skeleton";

export default async function Home() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8 py-8 lg:py-20 px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-3 lg:gap-4 text-center px-2">
        <h1 className="flex items-center gap-2 lg:gap-3 font-mono text-2xl lg:text-4xl font-bold text-foreground">
          <span className="text-accent-green">&gt;</span>
          <span className="text-xl lg:text-4xl">
            paste your code. get roasted.
          </span>
        </h1>
        <p className="font-mono text-xs lg:text-sm text-muted-foreground px-4">
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
      <div className="h-8 lg:h-16" />

      {/* Leaderboard Preview */}
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardPreview />
      </Suspense>
    </div>
  );
}
