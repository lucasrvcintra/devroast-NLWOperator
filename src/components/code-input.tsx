"use client";

import {
  type TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface CodeInputProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  roastMode?: boolean;
  onRoastModeChange?: (checked: boolean) => void;
}

export function CodeInput({
  value,
  onChange,
  roastMode = false,
  onRoastModeChange,
  className,
  placeholder = "// paste your code here...",
  ...props
}: CodeInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = value.split("\n").length;
    setLineCount(lines > 0 ? lines : 1);
  }, [value]);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col rounded-md border border-border bg-card overflow-hidden">
        {/* Window Header */}
        <div className="flex h-10 items-center gap-3 border-b border-border px-4">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Code Area */}
        <div className="flex h-[360px] overflow-hidden">
          {/* Line Numbers */}
          <div
            ref={lineNumbersRef}
            className="flex w-12 flex-col overflow-hidden border-r border-border bg-card py-3 text-right"
          >
            {Array.from({ length: lineCount }, (_, i) => i + 1).map((num) => (
              <span
                key={`line-${num}`}
                className="font-mono text-[12px] leading-[1.6] pr-3 text-muted-foreground"
              >
                {num}
              </span>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            placeholder={placeholder}
            className="flex-1 resize-none bg-transparent p-3 font-mono text-[12px] leading-[1.6] text-foreground placeholder:text-muted-foreground focus:outline-none"
            spellCheck={false}
            {...props}
          />
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Toggle checked={roastMode} onCheckedChange={onRoastModeChange}>
            <span className="font-mono text-xs text-muted-foreground">
              roast mode
            </span>
          </Toggle>
          <span className="font-mono text-xs text-muted-foreground">
            {"// maximum sarcasm enabled"}
          </span>
        </div>
        <button
          type="button"
          disabled={!value}
          className="flex items-center gap-2 rounded-md bg-accent-green px-6 py-2.5 font-mono text-sm font-medium text-foreground enabled:hover:bg-accent-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>$</span>
          <span>roast_my_code</span>
        </button>
      </div>
    </div>
  );
}
