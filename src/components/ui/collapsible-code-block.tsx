"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { type HTMLAttributes, useState } from "react";
import type { BundledLanguage } from "shiki";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";
import { CodeBlockClient } from "@/components/code-block-client";

const collapsibleCodeBlock = tv({
  base: "flex flex-col rounded-md border border-border overflow-hidden",
  variants: {
    isCollapsed: {
      true: "max-h-[140px]",
      false: "max-h-none",
    },
  },
  defaultVariants: {
    isCollapsed: true,
  },
});

export interface CollapsibleCodeBlockProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapsibleCodeBlock> {
  code: string;
  lang: BundledLanguage;
}

export function CollapsibleCodeBlock({
  code,
  lang,
  className,
  isCollapsed: initialIsCollapsed = true,
  ...props
}: CollapsibleCodeBlockProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={twMerge(collapsibleCodeBlock({ isCollapsed, className }))}
      {...props}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-bg-surface border-b border-border">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          {lang}
        </span>
        <button
          type="button"
          onClick={toggleCollapse}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isCollapsed ? (
            <>
              Expand <ChevronDown size={12} />
            </>
          ) : (
            <>
              Collapse <ChevronUp size={12} />
            </>
          )}
        </button>
      </div>
      <div className="relative overflow-hidden bg-bg-input flex-1">
        <CodeBlockClient code={code} lang={lang} className="w-full" />
        {isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-input to-transparent flex items-end justify-center pb-3 pointer-events-none" />
        )}
      </div>
    </div>
  );
}

export { collapsibleCodeBlock };
