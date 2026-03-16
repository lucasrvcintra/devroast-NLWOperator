"use client";

import { CaretDown, X } from "@phosphor-icons/react";
import {
  type TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useLanguageDetection } from "@/hooks/use-language-detection";
import { useShikiHighlighter } from "@/hooks/use-shiki-highlighter";
import { LANGUAGE_LIST, LANGUAGES, type LanguageId } from "@/lib/languages";
import { cn } from "@/lib/utils";

interface CodeEditorProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  language?: LanguageId;
  onLanguageChange?: (language: LanguageId) => void;
  detectedLanguage?: string;
  onDetectedLanguageChange?: (language: string | null) => void;
  autoDetect?: boolean;
  roastMode?: boolean;
  onRoastModeChange?: (checked: boolean) => void;
}

export function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  detectedLanguage,
  onDetectedLanguageChange,
  autoDetect = true,
  roastMode = false,
  onRoastModeChange,
  className,
  placeholder = "// paste your code here...",
  ...props
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<
    LanguageId | undefined
  >(language);
  const [isAutoDetect, setIsAutoDetect] = useState(true);
  const [hasHighlight, setHasHighlight] = useState(false);

  const { highlight, isReady } = useShikiHighlighter();
  const { detectedLanguage: autoDetectedLanguage } = useLanguageDetection(
    value,
    isAutoDetect && autoDetect,
  );

  // Sync internal state with prop when prop changes
  useEffect(() => {
    if (language !== undefined) {
      setSelectedLanguage(language);
    }
  }, [language]);

  // When auto-detect is disabled, clear the selected language to re-enable it
  useEffect(() => {
    if (!isAutoDetect) {
      setSelectedLanguage(undefined);
    }
  }, [isAutoDetect]);

  // Determine effective language:
  // - if autoDetect is off: use selected or default javascript
  // - if autoDetect is on: use autoDetectedLanguage, then fallback
  const effectiveLanguage: LanguageId = isAutoDetect
    ? autoDetectedLanguage
      ? (autoDetectedLanguage as LanguageId)
      : selectedLanguage
        ? selectedLanguage
        : "javascript"
    : selectedLanguage
      ? selectedLanguage
      : "javascript";

  useEffect(() => {
    const lines = value.split("\n").length;
    setLineCount(lines > 0 ? lines : 1);
  }, [value]);

  useEffect(() => {
    if (onDetectedLanguageChange) {
      onDetectedLanguageChange(autoDetectedLanguage);
    }
  }, [autoDetectedLanguage, onDetectedLanguageChange]);

  useEffect(() => {
    if (!value || !isReady) {
      setHighlightedHtml("");
      setHasHighlight(false);
      return;
    }

    const doHighlight = async () => {
      const html = highlight(value, effectiveLanguage);
      setHighlightedHtml(html);
      setHasHighlight(true);
    };

    doHighlight();
  }, [value, effectiveLanguage, isReady, highlight]);

  // Click outside to close language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    };

    if (isLangDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLangDropdownOpen]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current) {
      const { scrollTop, scrollLeft } = textareaRef.current;
      if (highlightedRef.current) {
        highlightedRef.current.scrollTop = scrollTop;
        highlightedRef.current.scrollLeft = scrollLeft;
      }
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }
    }
  }, []);

  const handleLanguageSelect = (langId: LanguageId) => {
    setSelectedLanguage(langId);
    if (onLanguageChange) {
      onLanguageChange(langId);
    }
    setIsLangDropdownOpen(false);
  };

  const handleClear = () => {
    onChange("");
    if (onDetectedLanguageChange) {
      onDetectedLanguageChange(null);
    }
  };

  const currentLang = LANGUAGES[effectiveLanguage];

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
          <div className="flex-1" />
          {/* Language Selector */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="sm"
              disabled={isAutoDetect}
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="font-mono text-xs"
            >
              <span>{currentLang?.name || "Plain Text"}</span>
              <CaretDown className="h-3 w-3" />
            </Button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 max-h-60 w-40 overflow-auto rounded-md border border-border bg-card shadow-lg">
                {LANGUAGE_LIST.map((lang) => (
                  <button
                    key={lang.shikiId}
                    type="button"
                    onClick={() =>
                      handleLanguageSelect(lang.shikiId as LanguageId)
                    }
                    className={cn(
                      "w-full px-3 py-2 text-left font-mono text-xs hover:bg-accent hover:text-foreground transition-colors",
                      lang.shikiId === effectiveLanguage
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Auto-detect toggle */}
          <Toggle
            label="auto"
            checked={isAutoDetect}
            onCheckedChange={setIsAutoDetect}
            size="sm"
          />
        </div>

        {/* Code Area */}
        <div className="flex h-[360px] overflow-hidden relative">
          {/* Line Numbers */}
          <div
            ref={lineNumbersRef}
            className="flex w-12 flex-col overflow-hidden border-r border-border bg-card py-3 text-right shrink-0"
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

          {/* Editor Container with Overlay */}
          <div className="flex-1 relative overflow-hidden">
            {/* Highlighted code (below) */}
            {hasHighlight && (
              <div
                ref={highlightedRef}
                aria-hidden="true"
                className="absolute inset-0 p-3 font-mono text-[12px] leading-[1.6] overflow-hidden whitespace-pre pointer-events-none [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent"
                dangerouslySetInnerHTML={{
                  __html: highlightedHtml,
                }}
              />
            )}

            {/* Textarea (above, transparent text when highlight is active) */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onScroll={handleScroll}
              placeholder={placeholder}
              spellCheck={false}
              className={cn(
                "absolute inset-0 w-full h-full resize-none bg-transparent p-3 font-mono text-[12px] leading-[1.6] placeholder:text-muted-foreground focus:outline-none z-10",
                hasHighlight
                  ? "text-transparent caret-accent-green"
                  : "text-foreground caret-accent-green",
              )}
              {...props}
            />
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Toggle
            label="roast mode"
            checked={roastMode}
            onCheckedChange={onRoastModeChange}
          />
          <span className="font-mono text-xs text-muted-foreground">
            {"// maximum sarcasm enabled"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={!value}
            className="font-mono text-xs"
          >
            <X className="h-3 w-3" />
            <span>clear</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={!value}
            className="font-mono text-sm"
          >
            <span>$</span>
            <span>roast_my_code</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
