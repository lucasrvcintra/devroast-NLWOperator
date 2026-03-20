export function RoastResultSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Score Hero Skeleton */}
      <div className="flex justify-center gap-12">
        <div className="w-32 h-32 rounded-full bg-muted" />
        <div className="flex flex-col gap-4 justify-center max-w-xl">
          <div className="h-4 w-48 bg-muted rounded" />
          <div className="h-8 w-full bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>

      {/* Code Block Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-48 bg-muted rounded-md border border-border" />
      </div>

      {/* Analysis Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-40 bg-muted rounded" />
        <div className="grid grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-muted rounded-md border border-border"
            />
          ))}
        </div>
      </div>

      {/* Suggested Fix Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-36 bg-muted rounded" />
        <div className="h-40 bg-muted rounded-md border border-border" />
      </div>
    </div>
  );
}
