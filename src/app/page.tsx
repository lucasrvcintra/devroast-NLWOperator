"use client";

import Link from "next/link";
import { useState } from "react";
import { CodeInput } from "@/components/code-input";
import { Card } from "@/components/ui/card";
import {
  CodeCell,
  LangCell,
  RankCell,
  ScoreCell,
  TableRow,
} from "@/components/ui/table-row";

export default function Home() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(false);

  const leaderboardData = [
    {
      rank: 1,
      code: "function sum(a, b) { return a + b; }",
      lang: "javascript",
      score: 9.8,
    },
    {
      rank: 2,
      code: "const x = () => { console.log('x'); }",
      lang: "javascript",
      score: 8.2,
    },
    {
      rank: 3,
      code: "if (true) { return false; }",
      lang: "javascript",
      score: 7.5,
    },
  ];

  return (
    <div className="flex flex-col gap-8 py-20">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-4 text-center">
        <h1 className="flex items-center gap-3 font-mono text-4xl font-bold text-foreground">
          <span className="text-accent-green">&gt;</span>
          paste your code. get roasted.
        </h1>
        <p className="font-mono text-sm text-muted-foreground">
          {
            "// drop your code below and we&apos;ll rate it — brutally honest or full roast mode"
          }
        </p>
      </section>

      {/* Code Input Area */}
      <CodeInput
        value={code}
        onChange={setCode}
        roastMode={roastMode}
        onRoastModeChange={setRoastMode}
      />

      {/* Footer Stats */}
      <section className="flex items-center justify-center gap-6">
        <span className="font-mono text-xs text-muted-foreground">
          2,847 codes roasted
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="font-mono text-xs text-muted-foreground">
          avg score: 4.2/10
        </span>
      </section>

      {/* Spacer */}
      <div className="h-16" />

      {/* Leaderboard Preview */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg font-semibold text-foreground">
            leaderboard
          </h2>
          <Link
            href="/leaderboard"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            view all &gt;&gt;
          </Link>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {"// the worst code on the internet, ranked by shame"}
        </p>

        <Card>
          {leaderboardData.map((item, index) => (
            <TableRow
              key={item.rank}
              variant={
                index < leaderboardData.length - 1 ? "default" : undefined
              }
            >
              <RankCell>#{item.rank}</RankCell>
              <CodeCell>{item.code}</CodeCell>
              <LangCell>{item.lang}</LangCell>
              <ScoreCell score={item.score} />
            </TableRow>
          ))}
        </Card>

        <p className="text-center font-mono text-xs text-muted-foreground pt-4">
          showing top 3 of 2,847 ·{" "}
          <Link
            href="/leaderboard"
            className="hover:text-foreground transition-colors"
          >
            view full leaderboard
          </Link>{" "}
          &gt;&gt;
        </p>
      </section>

      {/* Bottom Spacer */}
      <div className="h-16" />
    </div>
  );
}
