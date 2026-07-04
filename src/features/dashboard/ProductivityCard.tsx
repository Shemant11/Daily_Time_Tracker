import { Gauge } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Badge } from "@/components/ui/Badge";
import type { ProductivityBreakdown } from "@/types";

const labelTone: Record<ProductivityBreakdown["label"], "success" | "accent" | "ember" | "danger"> = {
  Excellent: "success",
  Good: "accent",
  Average: "ember",
  "Needs Improvement": "danger",
};

export function ProductivityCard({ breakdown }: { breakdown: ProductivityBreakdown }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge size={14} /> Productivity Score
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex items-center gap-5">
        <ProgressRing value={breakdown.score} size={100} strokeWidth={8} color="hsl(var(--ember))">
          <span className="font-display text-xl font-bold tabular">{breakdown.score}</span>
        </ProgressRing>
        <div className="flex-1 space-y-1.5">
          <Badge tone={labelTone[breakdown.label]}>{breakdown.label}</Badge>
          <ul className="text-xs text-ink-faint space-y-0.5 mt-2">
            <li>Goal completion: +{breakdown.components.goalCompletion}</li>
            <li>Exercise: +{breakdown.components.exercise}</li>
            <li>Consistency (7d): +{breakdown.components.consistency}</li>
            <li>Streak bonus: +{breakdown.components.streak}</li>
            {breakdown.components.missedPenalty !== 0 && (
              <li className="text-danger">Missed sessions: {breakdown.components.missedPenalty}</li>
            )}
            {breakdown.components.lateStartPenalty !== 0 && (
              <li className="text-danger">Late start: {breakdown.components.lateStartPenalty}</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
