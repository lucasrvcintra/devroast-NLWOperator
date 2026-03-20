import { forwardRef, type HTMLAttributes } from "react";
import type { BundledLanguage } from "shiki";
import { tv, type VariantProps } from "tailwind-variants";
import { CollapsibleCodeBlock } from "@/components/ui/collapsible-code-block";

const entryVariants = tv({
  base: "w-full overflow-hidden rounded-md border border-border bg-card",
  variants: {},
  defaultVariants: {},
});

export interface LeaderboardEntryProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof entryVariants> {
  rank: number;
  score: number;
  language: string;
  lines: number;
  code: string[];
}

export const LeaderboardEntry = forwardRef<
  HTMLDivElement,
  LeaderboardEntryProps
>(({ className, rank, score, language, lines, code, ...props }, ref) => {
  const codeString = code.join("\n");

  return (
    <div ref={ref} className={entryVariants({ className })} {...props}>
      <div className="flex h-12 items-center justify-between border-b border-border px-3 lg:px-5 overflow-x-auto">
        <div className="flex items-center gap-3 lg:gap-4 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground shrink-0">#</span>
            <span className="font-mono text-sm font-bold text-accent-amber shrink-0">
              {rank}
            </span>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-mono text-xs text-muted-foreground shrink-0">
              score:
            </span>
            <span className="font-mono text-sm font-bold text-accent-red shrink-0">
              {score}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          <span className="font-mono text-xs text-muted-foreground">
            {language}
          </span>
          <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
            {lines} lines
          </span>
        </div>
      </div>
      <div className="bg-bg-input p-2 lg:p-4 overflow-x-auto">
        <CollapsibleCodeBlock
          code={codeString}
          lang={language as BundledLanguage}
        />
      </div>
    </div>
  );
});

LeaderboardEntry.displayName = "LeaderboardEntry";
