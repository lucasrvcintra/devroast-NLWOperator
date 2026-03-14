import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-accent-green font-mono text-xl font-bold">
            &gt;
          </span>
          <span className="font-mono text-lg font-medium text-foreground">
            devroast
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/leaderboard"
            className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            leaderboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
