import { LeaderboardEntry } from "@/components/leaderboard-entry";
import { caller } from "@/trpc/server";

export const revalidate = 3600;

async function getLeaderboardEntries() {
  "use cache";
  return caller.roast.getLeaderboard({ limit: 20 });
}

export async function LeaderboardList() {
  const entries = await getLeaderboardEntries();

  return (
    <div className="flex flex-col gap-5">
      {entries.map((entry, index) => (
        <LeaderboardEntry
          key={entry.id}
          rank={index + 1}
          score={entry.score}
          language={entry.language}
          lines={entry.lines}
          code={entry.code.split("\n")}
        />
      ))}
    </div>
  );
}
