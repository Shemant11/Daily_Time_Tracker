import { type HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type Tone = "accent" | "success" | "danger" | "ember" | "neutral";

const tones: Record<Tone, string> = {
  accent: "bg-accent/15 text-accent border-accent/30",
  success: "bg-success/15 text-success border-success/30",
  danger: "bg-danger/15 text-danger border-danger/30",
  ember: "bg-ember/15 text-ember border-ember/30",
  neutral: "bg-base-soft text-ink-muted border-border",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
