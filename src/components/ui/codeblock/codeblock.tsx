import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export async function CodeBlock({
  code,
  language = "javascript",
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const highlightedCode = await codeToHtml(code, {
    lang: language,
    theme: "vesper",
  });

  const lines = code.split("\n");

  return (
    <div className="w-full overflow-hidden rounded-md border border-border bg-card">
      <div className="flex h-10 items-center gap-3 border-b border-border px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        <div className="flex-1" />
        {filename && (
          <span className="font-mono text-[12px] text-muted-foreground">
            {filename}
          </span>
        )}
      </div>
      <div className="flex">
        {showLineNumbers && (
          <div className="flex w-10 flex-col border-r border-border bg-card py-3 text-right">
            {lines.map((_, i) => (
              <span
                // biome-ignore lint/a11y/noStaticElementInteractions: line numbers are decorative
                key={`line-${i}`}
                className="font-mono text-[13px] leading-[1.6] pr-3 text-muted-foreground"
              >
                {i + 1}
              </span>
            ))}
          </div>
        )}
        {/* eslint-disable-next-line react/no-dangerously-set-inner-with-children */}
        <div
          className="flex-1 overflow-x-auto p-3 font-mono text-[13px] leading-[1.6] [&_pre]:!m-0 [&_pre]:!bg-transparent [&_code]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  );
}
