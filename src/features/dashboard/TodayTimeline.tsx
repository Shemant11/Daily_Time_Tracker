import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { resolveIcon } from "@/utils/icons";
import { formatMinutes } from "@/utils/time";
import type { Category, Session, Subtask } from "@/types";

export function TodayTimeline({
  sessions,
  categories,
  subtasks,
}: {
  sessions: Session[];
  categories: Category[];
  subtasks: Subtask[];
}) {
  const sorted = [...sessions].sort((a, b) => a.startTime - b.startTime);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock size={14} /> Today&apos;s Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {sorted.length === 0 ? (
          <p className="text-sm text-ink-faint py-6 text-center">
            No sessions logged yet today. Start a timer to begin your timeline.
          </p>
        ) : (
          <ol className="relative border-l border-border/60 ml-2 space-y-5">
            {sorted.map((s) => {
              const cat = categories.find((c) => c.id === s.categoryId);
              const sub = subtasks.find((t) => t.id === s.subtaskId);
              const Icon = resolveIcon(cat?.icon ?? "Target");
              return (
                <li key={s.id} className="ml-4">
                  <span
                    className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-base"
                    style={{ backgroundColor: cat?.color ?? "#818CF8" }}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon size={14} style={{ color: cat?.color }} />
                      <p className="text-sm font-medium truncate">
                        {cat?.name}
                        {sub ? ` · ${sub.name}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-ink-faint shrink-0 tabular">
                      {formatMinutes(s.durationSeconds / 60)}
                    </span>
                  </div>
                  <p className="text-xs text-ink-faint">
                    {format(s.startTime, "h:mm a")} – {format(s.endTime, "h:mm a")}
                  </p>
                  {s.notes && <p className="text-xs text-ink-muted mt-0.5 italic">&ldquo;{s.notes}&rdquo;</p>}
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
