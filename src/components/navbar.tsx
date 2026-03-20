"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/ui/theme-provider";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-10 gap-4">
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
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-bg-input transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <SunIcon className="w-4 h-4 text-muted-foreground" />
            ) : (
              <MoonIcon className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
