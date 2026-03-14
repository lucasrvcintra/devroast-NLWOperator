"use client";

import { Switch } from "@base-ui/react";
import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const toggleVariants = tv({
  base: "inline-flex items-center gap-3 cursor-pointer",
  variants: {
    size: {
      sm: "[&_.switch-root]:h-[18px] [&_.switch-root]:w-[32px] [&_.switch-root]:rounded-[9px] [&_.switch-thumb]:size-3 [&_.switch-label]:text-[11px]",
      default:
        "[&_.switch-root]:h-[22px] [&_.switch-root]:w-[40px] [&_.switch-root]:rounded-[11px] [&_.switch-thumb]:size-4 [&_.switch-label]:text-[12px]",
      lg: "[&_.switch-root]:h-[26px] [&_.switch-root]:w-[48px] [&_.switch-root]:rounded-[13px] [&_.switch-thumb]:size-5 [&_.switch-label]:text-[13px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof toggleVariants> {
  label?: string;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      className,
      size,
      label,
      checked: controlledChecked,
      defaultChecked,
      id,
      onCheckedChange,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledChecked !== undefined;
    const [internalChecked, setInternalChecked] = useState(
      defaultChecked ?? false,
    );

    const isChecked = isControlled ? controlledChecked : internalChecked;

    const handleOnCheckedChange = (checked: boolean) => {
      if (!isControlled) {
        setInternalChecked(checked);
      }
      onCheckedChange?.(checked);
    };

    return (
      <div className={toggleVariants({ size, className })}>
        <Switch.Root
          ref={ref}
          checked={isChecked}
          onCheckedChange={handleOnCheckedChange}
          id={id}
          className={cn(
            "switch-root peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isChecked ? "bg-accent-green" : "bg-border",
          )}
        >
          <Switch.Thumb
            className={cn(
              "switch-thumb pointer-events-none block size-4 rounded-full transition-transform duration-200",
              isChecked
                ? "translate-x-[18px] bg-foreground"
                : "translate-x-0 bg-gray-200",
            )}
          />
        </Switch.Root>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "switch-label cursor-pointer font-mono transition-colors",
              isChecked ? "text-accent-green" : "text-foreground",
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
