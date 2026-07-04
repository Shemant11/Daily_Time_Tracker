import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
  tone?: "accent" | "ember" | "success" | "danger";
}

const toneMap = {
  accent: "text-accent bg-accent/12",
  ember: "text-ember bg-ember/12",
  success: "text-success bg-success/12",
  danger: "text-danger bg-danger/12",
};

export function StatCard({ label, value, sublabel, icon: Icon, tone = "accent" }: StatCardProps) {
  return (
    <Card className="p-4 flex items-center gap-3.5">
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", toneMap[tone])}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-ink-faint font-medium truncate">{label}</p>
        <p className="font-display text-lg font-bold leading-tight tabular">{value}</p>
        {sublabel && <p className="text-xs text-ink-faint truncate">{sublabel}</p>}
      </div>
    </Card>
  );
}
