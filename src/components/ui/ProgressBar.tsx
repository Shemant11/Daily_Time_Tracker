import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { clampPercent } from "@/utils/time";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  colorFrom?: string;
  colorTo?: string;
  height?: number;
}

export function ProgressBar({ value, className, colorFrom = "#818CF8", colorTo = "#34D399", height = 10 }: ProgressBarProps) {
  const pct = clampPercent(value);
  return (
    <div
      className={cn("w-full rounded-full bg-base-soft overflow-hidden border border-border/50", className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})` }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}
