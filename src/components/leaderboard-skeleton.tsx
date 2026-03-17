export function LeaderboardSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-4 w-72 animate-pulse rounded bg-muted" />

      <div className="flex flex-col border border-border">
        {[...Array(20)].map((_, i) => (
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
