import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const cardVariants = tv({
  base: "border border-border rounded-m p-5 flex flex-col gap-3",
  variants: {
    variant: {
      default: "bg-background",
      critical: "bg-background border-l-4 border-l-accent-red",
      warning: "bg-background border-l-4 border-l-accent-amber",
      good: "bg-background border-l-4 border-l-accent-green",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  label?: string;
  labelVariant?: "critical" | "warning" | "good" | "info";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      label,
      labelVariant = "critical",
      children,
      ...props
    },
    ref,
  ) => {
    const labelDotColorClasses: Record<string, string> = {
      critical: "bg-accent-red",
      warning: "bg-accent-amber",
      good: "bg-accent-green",
      info: "bg-(--blue)",
    };

    const labelTextColorClasses: Record<string, string> = {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
      info: "text-(--blue)",
    };

    return (
      <div
        ref={ref}
        className={cardVariants({ variant, className })}
        {...props}
      >
        {label && (
          <div className="flex items-center gap-2">
            <span
              className={cn("rounded-full", labelDotColorClasses[labelVariant])}
              style={{ width: 8, height: 8 }}
            />
            <span
              className={cn(
                "font-mono text-[12px]",
                labelTextColorClasses[labelVariant],
              )}
            >
              {label}
            </span>
          </div>
        )}
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export interface CardTitleProps extends HTMLAttributes<HTMLSpanElement> {}

const CardTitle = forwardRef<HTMLSpanElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("font-mono text-[13px] text-foreground", className)}
        {...props}
      />
    );
  },
);

CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends HTMLAttributes<HTMLSpanElement> {}

const CardDescription = forwardRef<HTMLSpanElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "font-mono text-[12px] text-muted-foreground leading-relaxed",
          className,
        )}
        {...props}
      />
    );
  },
);

CardDescription.displayName = "CardDescription";

export { Card, CardDescription, CardTitle, cardVariants };
