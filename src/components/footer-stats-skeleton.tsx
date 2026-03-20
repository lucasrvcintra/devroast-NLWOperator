export function FooterStatsSkeleton() {
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
