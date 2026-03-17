"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";

export function LeaderboardStats() {
  const trpc = useTRPC();
  const { data, isLoading } = useSuspenseQuery(
    trpc.roast.getStats.queryOptions(),
  );

  if (isLoading) {
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

  const totalRoasts = data?.totalRoasts ?? 0;
  const avgScore = data?.avgScore ?? 0;

  return (
    <section className="flex items-center gap-2">
      <span className="font-mono text-xs text-muted-foreground">
        <AnimatedNumber value={totalRoasts} /> submissions
      </span>
      <span className="font-mono text-xs text-muted-foreground">·</span>
      <span className="font-mono text-xs text-muted-foreground">
        avg score:{" "}
        <AnimatedNumber
          value={avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
        /10
      </span>
    </section>
  );
}

function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format?: Intl.NumberFormatOptions;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - (1 - progress) ** 3;
      const current = value * easeOut;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const formatted = new Intl.NumberFormat("en-US", format).format(displayValue);

  return <span>{formatted}</span>;
}
