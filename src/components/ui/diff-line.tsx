import { forwardRef, type HTMLAttributes } from "react";

import { tv, type VariantProps } from "tailwind-variants";

const diffLineVariants = tv({
  base: "flex w-full font-mono text-[13px] leading-[1.6] px-4 py-2",
  variants: {
    type: {
      removed: "bg-[#1A0A0A] text-muted-foreground [&_span]:text-accent-red",
      added: "bg-[#0A1A0F] text-foreground [&_span]:text-accent-green",
      context: "text-muted-foreground [&_span]:text-muted-foreground/60",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

export interface DiffLineProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof diffLineVariants> {
  prefix?: string;
}

const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, type, prefix = " ", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={diffLineVariants({ type, className })}
        {...props}
      >
        <span className="w-4 flex-shrink-0">{prefix}</span>
        <span className="flex-1">{children}</span>
      </div>
    );
  },
);

DiffLine.displayName = "DiffLine";

export { DiffLine, diffLineVariants };
