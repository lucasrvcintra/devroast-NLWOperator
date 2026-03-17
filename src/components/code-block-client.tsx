"use client";

import { useEffect, useState } from "react";
import { type BundledLanguage, codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";
import { useTheme } from "@/components/ui/theme-provider";

export interface CodeBlockClientProps {
  code: string;
  lang: BundledLanguage;
  className?: string;
}

export function CodeBlockClient({
  code,
  lang,
  className,
}: CodeBlockClientProps) {
  const { theme } = useTheme();
  const [html, setHtml] = useState<string>("");
  const lines = code.split("\n");

  useEffect(() => {
    codeToHtml(code, {
      lang,
      theme: theme === "dark" ? "vesper" : "github-light",
    }).then(setHtml);
  }, [code, lang, theme]);

  if (!html) {
    return <div className="h-20 bg-bg-input animate-pulse" />;
  }

  return (
    <div
      className={twMerge(
        "border border-border-primary overflow-hidden",
        className,
      )}
    >
      <div
        className={twMerge(
          "flex",
          theme === "dark" ? "bg-[#1a1a1a]" : "bg-gray-50",
        )}
      >
        <div
          className={twMerge(
            "flex flex-col items-end gap-1.5 py-3 px-2.5 w-10 border-r border-border-primary select-none shrink-0",
            theme === "dark" ? "bg-[#0a0a0a]" : "bg-gray-100",
          )}
        >
          {lines.map((_, i) => (
            <span
              key={`ln-${i.toString()}`}
              className="font-mono text-[13px] leading-tight text-text-tertiary"
            >
              {i + 1}
            </span>
          ))}
        </div>
        <div
          className="flex-1 p-3 overflow-x-auto font-mono text-[13px] leading-tight [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent [&_.line]:leading-[1.65]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
