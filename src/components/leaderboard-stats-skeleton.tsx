export function LeaderboardStatsSkeleton() {
  return (
    <section className="flex items-center gap-2">
      <span className="font-mono text-xs text-muted-foreground">
        <span className="inline-block w-16 animate-pulse rounded bg-muted">
          &nbsp;
        </span>{" "}
        submissions
      </span>
      <span className="font-mono text-xs text-muted-foreground">·</span>
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
