import type { Metadata } from "next";
import { LeaderboardEntry } from "@/components/leaderboard-entry";

export const metadata: Metadata = {
  title: "shame_leaderboard | devroast",
  description: "The most roasted code on the internet",
};

const LEADERBOARD_DATA = [
  {
    rank: 1,
    score: 1.2,
    language: "javascript",
    lines: 3,
    code: [
      `eval(prompt("enter code"))`,
      `document.write(response)`,
      `// trust the user lol`,
    ],
  },
  {
    rank: 2,
    score: 1.8,
    language: "typescript",
    lines: 3,
    code: [
      `if (x == true) { return true; }`,
      `else if (x == false) { return false; }`,
      `else { return !false; }`,
    ],
  },
  {
    rank: 3,
    score: 2.1,
    language: "sql",
    lines: 2,
    code: [`SELECT * FROM users WHERE 1=1`, `-- TODO: add authentication`],
  },
  {
    rank: 4,
    score: 2.3,
    language: "java",
    lines: 3,
    code: [`catch (e) {`, `  // ignore`, `}`],
  },
  {
    rank: 5,
    score: 2.5,
    language: "javascript",
    lines: 3,
    code: [
      `const sleep = (ms) =>`,
      `  new Date(Date.now() + ms)`,
      `  while(new Date() < end) {}`,
    ],
  },
];

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-20 py-10">
      <div className="mb-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-accent-green">
            &gt;
          </span>
          <h1 className="font-mono text-[28px] font-bold text-foreground">
            shame_leaderboard
          </h1>
        </div>
        <p className="font-mono text-sm text-muted-foreground">
          {"// the most roasted code on the internet"}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            2,847 submissions
          </span>
          <span className="font-mono text-xs text-muted-foreground">·</span>
          <span className="font-mono text-xs text-muted-foreground">
            avg score: 4.2/10
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {LEADERBOARD_DATA.map((entry) => (
          <LeaderboardEntry
            key={entry.rank}
            rank={entry.rank}
            score={entry.score}
            language={entry.language}
            lines={entry.lines}
            code={entry.code}
          />
        ))}
      </div>
    </div>
  );
}
