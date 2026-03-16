import type { Metadata } from "next";
import { CodeBlock, CodeBlockHeader } from "@/components/ui/codeblock";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";

export const metadata: Metadata = {
  title: "Roast Results | devroast",
  description: "Your code has been roasted",
};

const SUBMITTED_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

const ISSUES = [
  {
    severity: "critical" as const,
    title: "using var instead of const/let",
    description:
      "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
  },
  {
    severity: "warning" as const,
    title: "imperative loop pattern",
    description:
      "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
  },
  {
    severity: "good" as const,
    title: "clear naming conventions",
    description:
      "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
  },
  {
    severity: "good" as const,
    title: "single responsibility",
    description:
      "the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
  },
];

const DIFF_LINES = [
  { type: "context" as const, content: "function calculateTotal(items) {" },
  { type: "removed" as const, content: "  var total = 0;" },
  {
    type: "removed" as const,
    content: "  for (var i = 0; i < items.length; i++) {",
  },
  { type: "removed" as const, content: "    total = total + items[i].price;" },
  { type: "removed" as const, content: "  }" },
  { type: "removed" as const, content: "  return total;" },
  {
    type: "added" as const,
    content: "  return items.reduce((sum, item) => sum + item.price, 0);",
  },
  { type: "context" as const, content: "}" },
];

export default function RoastResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="mx-auto max-w-[1440px] px-20 py-10">
      {/* Score Hero */}
      <div className="flex justify-center gap-12 mb-10">
        <ScoreRing score={3.5} size="lg" />
        <div className="flex flex-col gap-4 justify-center max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span className="font-mono text-sm font-medium text-accent-red">
              verdict: needs_serious_help
            </span>
          </div>
          <h1 className="font-mono text-xl leading-relaxed text-foreground">
            &quot;this code looks like it was written during a power outage...
            in 2005.&quot;
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">
              lang: javascript
            </span>
            <span className="font-mono text-xs text-muted-foreground">·</span>
            <span className="font-mono text-xs text-muted-foreground">
              7 lines
            </span>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 font-mono text-xs text-foreground border border-border rounded-md w-fit hover:bg-secondary transition-colors"
          >
            $ share_roast
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-primary mb-10" />

      {/* Submitted Code */}
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
          <CodeBlockHeader filename="your_code.ts" />
          <CodeBlock code={SUBMITTED_CODE} lang="typescript" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-primary mb-10" />

      {/* Analysis Section */}
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
          {ISSUES.map((issue) => (
            <div
              key={issue.title}
              className="flex flex-col gap-3 p-5 border border-border rounded-md"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    issue.severity === "critical"
                      ? "bg-accent-red"
                      : issue.severity === "warning"
                        ? "bg-accent-amber"
                        : "bg-accent-green"
                  }`}
                />
                <span
                  className={`font-mono text-xs font-medium ${
                    issue.severity === "critical"
                      ? "text-accent-red"
                      : issue.severity === "warning"
                        ? "text-accent-amber"
                        : "text-accent-green"
                  }`}
                >
                  {issue.severity}
                </span>
              </div>
              <h3 className="font-mono text-sm font-medium text-foreground">
                {issue.title}
              </h3>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                {issue.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-primary mb-10" />

      {/* Suggested Fix */}
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
              your_code.ts → improved_code.ts
            </span>
          </div>
          <div className="flex flex-col">
            {DIFF_LINES.map((line) => (
              <DiffLine
                key={`${line.type}-${line.content.slice(0, 10)}`}
                type={line.type}
              >
                {line.content}
              </DiffLine>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
