import { useMemo } from "react";
import { eachDayOfInterval, subDays, format, getDay } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { todayKey, clampPercent } from "@/utils/time";
import type { DayAggregate } from "@/types";

function intensity(pct: number) {
  if (pct <= 0) return "bg-base-soft border-border/40";
  if (pct < 25) return "bg-accent/20 border-accent/30";
  if (pct < 50) return "bg-accent/40 border-accent/40";
  if (pct < 100) return "bg-accent/70 border-accent/60";
  return "bg-accent border-accent";
}

export function LearningHeatmap({ aggregates }: { aggregates: Map<string, DayAggregate> }) {
  const days = useMemo(() => eachDayOfInterval({ start: subDays(new Date(), 118), end: new Date() }), []);

  // group into weeks (columns), Monday-start
  const weeks = useMemo(() => {
    const cols: Date[][] = [];
    let col: Date[] = [];
    days.forEach((d, i) => {
      col.push(d);
      const dow = getDay(d); // 0 = Sunday
      if (dow === 0 || i === days.length - 1) {
        cols.push(col);
        col = [];
      }
    });
    return cols;
  }, [days]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 overflow-x-auto">
        <div className="flex gap-1">
          {weeks.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-1">
              {col.map((d) => {
                const key = todayKey(d);
                const agg = aggregates.get(key);
                const pct = agg ? clampPercent(agg.completion * 100) : 0;
                return (
                  <div
                    key={key}
                    title={`${format(d, "MMM d")} — ${Math.round(pct)}%`}
                    className={`w-3 h-3 rounded-sm border ${intensity(pct)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
