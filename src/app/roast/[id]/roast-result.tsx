"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { CodeBlockClient } from "@/components/code-block-client";
import { CodeBlockHeader } from "@/components/ui/codeblock";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { useTRPC } from "@/trpc/client";

interface RoastResultProps {
  id: string;
}

export function RoastResult({ id }: RoastResultProps) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.roast.getById.queryOptions({ id }));

  const { roast, analysisItems } = data;

  const suggestedFix = roast.suggestedFix
    ? (JSON.parse(roast.suggestedFix) as Array<{
        type: "context" | "removed" | "added";
        content: string;
      }>)
    : [];

  const severityColors = {
    critical: "red",
    warning: "amber",
    good: "green",
  } as const;

  return (
    <div className="mx-auto max-w-[1440px] px-20 py-10">
      <div className="flex justify-center gap-12 mb-10">
        <ScoreRing score={roast.score} size="lg" />
        <div className="flex flex-col gap-4 justify-center max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="font-mono text-sm font-medium text-accent-red">
              verdict: {roast.verdict}
            </span>
          </div>
          <h1 className="font-mono text-xl leading-relaxed text-foreground">
            &quot;{roast.roastQuote}&quot;
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">
              lang: {roast.language}
            </span>
            <span className="font-mono text-xs text-muted-foreground">·</span>
            <span className="font-mono text-xs text-muted-foreground">
              {roast.lineCount} lines
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border mb-10" />

      <div className="flex flex-col gap-4 mb-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-foreground">
            your_submission
          </span>
        </div>
        <div className="border border-border rounded-md overflow-hidden">
          <CodeBlockHeader filename={`code.${roast.language}`} />
          <CodeBlockClient code={roast.code} lang={roast.language} />
        </div>
      </div>

      <div className="h-px bg-border mb-10" />

      <div className="flex flex-col gap-6 mb-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-foreground">
            detailed_analysis
          </span>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {analysisItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 p-5 border border-border rounded-md"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full bg-accent-${severityColors[item.severity]}`}
                />
                <span
                  className={`font-mono text-xs font-medium text-accent-${severityColors[item.severity]}`}
                >
                  {item.severity}
                </span>
              </div>
              <h3 className="font-mono text-sm font-medium text-foreground">
                {item.title}
              </h3>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-border mb-10" />

      {suggestedFix.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-accent-green">
              {"//"}
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              suggested_fix
            </span>
          </div>
          <div className="border border-border rounded-md overflow-hidden bg-bg-input">
            <div className="flex items-center h-10 px-4 border-b border-border">
              <span className="font-mono text-xs text-muted-foreground">
                your_code.{roast.language} → improved_code.{roast.language}
              </span>
            </div>
            <div className="flex flex-col">
              {suggestedFix.map((line) => (
                <DiffLine
                  key={`${line.type}-${line.content.slice(0, 30)}`}
                  type={line.type}
                >
                  {line.content}
                </DiffLine>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
