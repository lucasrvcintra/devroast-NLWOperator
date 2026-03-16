import { type ButtonHTMLAttributes, forwardRef } from "react";

import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer font-mono",
  variants: {
    variant: {
      default: "bg-accent-green text-foreground hover:bg-accent-green/90",
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary:
        "border border-border bg-transparent text-foreground hover:bg-secondary/80",
      destructive: "bg-destructive text-(--white) hover:bg-destructive/90",
      outline:
        "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline bg-transparent",
    },
    size: {
      default: "h-[34px] px-6 py-[10px] text-[13px] font-[500]",
      sm: "h-[30px] px-4 py-[8px] text-[12px]",
      lg: "h-[38px] px-8 py-[10px] text-[13px]",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
