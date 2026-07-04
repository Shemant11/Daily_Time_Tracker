import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
} from "date-fns";
import { cn } from "@/utils/cn";
import { todayKey } from "@/utils/time";
import type { DayAggregate } from "@/types";

const statusClass: Record<DayAggregate["status"], string> = {
  complete: "bg-success/20 border-success/50 text-success",
  partial: "bg-ember/15 border-ember/40 text-ember",
  missed: "bg-danger/10 border-danger/30 text-danger",
  future: "bg-transparent border-border/40 text-ink-faint",
};

export function MonthGrid({
  monthAnchor,
  aggregates,
  onSelectDay,
}: {
  monthAnchor: Date;
  aggregates: Map<string, DayAggregate>;
  onSelectDay: (date: string) => void;
}) {
  const start = startOfWeek(startOfMonth(monthAnchor), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(monthAnchor), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  return (
    <div>
      <div className="grid grid-cols-7 mb-2 text-center text-xs font-medium text-ink-faint">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const key = todayKey(day);
          const agg = aggregates.get(key);
          const inMonth = isSameMonth(day, monthAnchor);
          const status = agg?.status ?? (day > new Date() ? "future" : "missed");

          return (
            <button
              key={key}
              onClick={() => onSelectDay(key)}
              disabled={!inMonth}
              className={cn(
                "aspect-square rounded-xl border flex flex-col items-center justify-center gap-0.5 text-xs transition-transform hover:scale-105",
                inMonth ? statusClass[status] : "opacity-20 border-transparent",
                isToday(day) && "ring-2 ring-accent"
              )}
            >
              <span className="font-semibold">{format(day, "d")}</span>
              {agg && agg.totalMinutes > 0 && (
                <span className="text-[9px] tabular opacity-80">{Math.round(agg.totalMinutes)}m</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 mt-4 text-xs text-ink-faint">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-success" /> Target completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-ember" /> Partial
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-danger" /> Missed
        </span>
      </div>
    </div>
  );
}
