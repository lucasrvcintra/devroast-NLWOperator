import { AnimatedNumber } from "@/components/animated-number";
import { caller } from "@/trpc/server";

export const revalidate = 3600;

async function getStats() {
  "use cache";
  return caller.roast.getStats();
}

export async function FooterStats() {
  const stats = await getStats();

  return (
    <section className="flex items-center justify-center gap-6">
      <span className="font-mono text-xs text-muted-foreground">
        <AnimatedNumber value={stats.totalRoasts} /> codes roasted
      </span>
      <span className="text-muted-foreground">·</span>
      <span className="font-mono text-xs text-muted-foreground">
        avg score:{" "}
        <AnimatedNumber
          value={stats.avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
        /10
      </span>
    </section>
  );
}
