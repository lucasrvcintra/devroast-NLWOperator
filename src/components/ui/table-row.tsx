import { forwardRef, type HTMLAttributes } from "react";

import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const tableRowVariants = tv({
  base: "flex items-center border-b border-border py-4 px-5",
  variants: {
    variant: {
      default: "",
      highlighted: "bg-accent/50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface TableRowProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tableRowVariants> {}

const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-x-auto",
          tableRowVariants({ variant, className }),
        )}
        {...props}
      />
    );
  },
);

TableRow.displayName = "TableRow";

export interface TableCellProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  grow?: boolean;
}

const TableCell = forwardRef<HTMLDivElement, TableCellProps>(
  ({ className, width, grow, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          width: width,
          flexGrow: grow ? 1 : undefined,
          minWidth: width,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TableCell.displayName = "TableCell";

export interface RankCellProps extends HTMLAttributes<HTMLDivElement> {}

const RankCell = forwardRef<HTMLDivElement, RankCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <TableCell ref={ref} width={40} className={className} {...props}>
        <span className="font-mono text-[13px] text-muted-foreground">
          {children}
        </span>
      </TableCell>
    );
  },
);

RankCell.displayName = "RankCell";

export interface ScoreCellProps extends HTMLAttributes<HTMLDivElement> {
  score: number;
}

const ScoreCell = forwardRef<HTMLDivElement, ScoreCellProps>(
  ({ className, score, ...props }, ref) => {
    const scoreColorClass =
      score >= 7
        ? "text-accent-green"
        : score >= 4
          ? "text-accent-amber"
          : "text-accent-red";

    return (
      <TableCell ref={ref} width={60} className={className} {...props}>
        <span className={`font-mono text-[13px] font-bold ${scoreColorClass}`}>
          {score.toFixed(1)}
        </span>
      </TableCell>
    );
  },
);

ScoreCell.displayName = "ScoreCell";

export interface CodeCellProps extends HTMLAttributes<HTMLDivElement> {}

const CodeCell = forwardRef<HTMLDivElement, CodeCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <TableCell ref={ref} grow className={className} {...props}>
        <span className="font-mono text-[12px] text-muted-foreground truncate block">
          {children}
        </span>
      </TableCell>
    );
  },
);

CodeCell.displayName = "CodeCell";

export interface LangCellProps extends HTMLAttributes<HTMLDivElement> {}

const LangCell = forwardRef<HTMLDivElement, LangCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <TableCell ref={ref} width={100} className={className} {...props}>
        <span className="font-mono text-[12px] text-muted-foreground">
          {children}
        </span>
      </TableCell>
    );
  },
);

LangCell.displayName = "LangCell";

export { CodeCell, LangCell, RankCell, ScoreCell, TableCell, TableRow };
