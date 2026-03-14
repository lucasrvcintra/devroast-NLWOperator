import { forwardRef, type HTMLAttributes } from "react";

import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
  base: "inline-flex items-center gap-2 font-mono",
  variants: {
    variant: {
      critical: "text-accent-red [&>.badge-dot]:bg-accent-red",
      warning: "text-accent-amber [&>.badge-dot]:bg-accent-amber",
      good: "text-accent-green [&>.badge-dot]:bg-accent-green",
      info: "text-(--blue) [&>.badge-dot]:bg-(--blue)",
    },
    size: {
      sm: "[&>.badge-dot]:size-2 [&>.badge-dot]:h-2 [&>.badge-dot]:w-2 text-[11px]",
      default:
        "[&>.badge-dot]:size-2 [&>.badge-dot]:h-2 [&>.badge-dot]:w-2 text-[12px]",
      lg: "[&>.badge-dot]:size-3 [&>.badge-dot]:h-3 [&>.badge-dot]:w-3 text-[13px]",
    },
  },
  defaultVariants: {
    variant: "critical",
    size: "default",
  },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, dot = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={badgeVariants({ variant, size, className })}
        {...props}
      >
        {dot && <span className="badge-dot rounded-full bg-current" />}
        <span className="badge-text">{children}</span>
      </div>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
