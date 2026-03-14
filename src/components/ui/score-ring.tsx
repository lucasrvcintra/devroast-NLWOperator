import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const scoreRingVariants = tv({
  base: "relative inline-flex items-center justify-center",
  variants: {
    size: {
      sm: "h-[120px] w-[120px]",
      default: "h-[180px] w-[180px]",
      lg: "h-[240px] w-[240px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface ScoreRingProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scoreRingVariants> {
  score: number;
  maxScore?: number;
}

const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, size, score, maxScore = 10, ...props }, ref) => {
    const percentage = Math.min(score / maxScore, 1);

    const scoreColorClasses: Record<string, string> = {
      good: "text-accent-green",
      warning: "text-accent-amber",
      critical: "text-accent-red",
    };

    const getScoreColor = (score: number) => {
      if (score >= 7) return scoreColorClasses.good;
      if (score >= 4) return scoreColorClasses.warning;
      return scoreColorClasses.critical;
    };

    return (
      <div
        ref={ref}
        className={scoreRingVariants({ size, className })}
        {...props}
      >
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${percentage * 283} 283`}
            strokeLinecap="round"
            className={getScoreColor(score)}
          />
        </svg>
        <div className="flex flex-col items-center justify-center z-10">
          <span
            className={cn(
              "font-mono font-bold leading-none",
              getScoreColor(score),
            )}
            style={{
              fontSize: size === "sm" ? 24 : size === "lg" ? 64 : 48,
            }}
          >
            {score.toFixed(1)}
          </span>
          <span
            className="font-mono leading-none text-muted-foreground"
            style={{
              fontSize: size === "sm" ? 10 : size === "lg" ? 22 : 16,
            }}
          >
            /{maxScore}
          </span>
        </div>
      </div>
    );
  },
);

ScoreRing.displayName = "ScoreRing";

export { ScoreRing, scoreRingVariants };
