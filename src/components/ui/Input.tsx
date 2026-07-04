import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl border border-border bg-base-soft px-3 text-sm text-ink placeholder:text-ink-faint focus:border-accent transition-colors",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("text-xs font-medium text-ink-muted mb-1.5 block", className)} {...props} />
);
