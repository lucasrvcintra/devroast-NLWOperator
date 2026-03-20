"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const errorDisplayVariants = tv({
  base: "flex flex-col items-center justify-center gap-8 py-12",
  variants: {
    size: {
      full: "min-h-[60vh]",
      inline: "py-6",
    },
  },
  defaultVariants: {
    size: "full",
  },
});

const errorCodeVariants = tv({
  base: "font-mono font-bold",
  variants: {
    variant: {
      error: "text-6xl text-accent-red",
      warning: "text-6xl text-accent-amber",
      success: "text-6xl text-accent-green",
    },
  },
  defaultVariants: {
    variant: "error",
  },
});

const errorButtonVariants = tv({
  base: "font-mono text-sm px-6 py-3 rounded-m border border-border-primary bg-transparent text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors cursor-pointer",
});

export interface ErrorDisplayProps extends ComponentProps<"div"> {
  code?: number | string;
  title?: string;
  description?: string;
  variant?: "error" | "warning" | "success";
  size?: "full" | "inline";
  showRedirect?: boolean;
  redirectLabel?: string;
}

function ErrorDisplayRoot({
  code,
  title = "Something went wrong",
  description,
  variant = "error",
  size = "full",
  showRedirect = true,
  redirectLabel = "← Back to home",
  className,
  ...props
}: ErrorDisplayProps) {
  const router = useRouter();

  return (
    <div className={errorDisplayVariants({ size, className })} {...props}>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-accent-green font-mono">
          &gt;
        </span>
        <span className="text-xl font-mono text-text-primary">devroast</span>
      </div>

      {code && <span className={errorCodeVariants({ variant })}>{code}</span>}

      <div className="flex flex-col items-center gap-2">
        <span className="text-xl font-mono text-text-primary">{title}</span>
        {description && (
          <span className="text-sm font-mono text-text-secondary text-center max-w-md">
            {description}
          </span>
        )}
      </div>

      {showRedirect && (
        <button
          type="button"
          onClick={() => router.push("/")}
          className={errorButtonVariants()}
        >
          {redirectLabel}
        </button>
      )}
    </div>
  );
}

export {
  ErrorDisplayRoot,
  errorButtonVariants,
  errorCodeVariants,
  errorDisplayVariants,
};
