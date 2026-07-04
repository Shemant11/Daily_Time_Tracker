import { useMemo } from "react";
import { Play, Pause, Square } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { useTimerStore } from "@/store/useTimerStore";
import { useTick } from "@/hooks/useTick";
import { resolveIcon } from "@/utils/icons";
import { formatHMS, formatMinutes, clampPercent } from "@/utils/time";
import type { Category, Subtask, Session } from "@/types";

interface CategoryCardProps {
  category: Category;
  subtasks: Subtask[];
  todaySessions: Session[];
}

function minutesFor(sessions: Session[], categoryId: string, subtaskId: string | null) {
  return (
    sessions
      .filter((s) => s.categoryId === categoryId && (subtaskId === null || s.subtaskId === subtaskId))
      .reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  );
}

export function CategoryCard({ category, subtasks, todaySessions }: CategoryCardProps) {
  const { timer, start, pause, resume, stop } = useTimerStore();
  const Icon = resolveIcon(category.icon);
  const isRunning = timer.status === "running";
  const now = useTick(1000, isRunning);

  const categoryMinutes = minutesFor(todaySessions, category.id, null);
  const categoryPct = clampPercent((categoryMinutes / Math.max(1, category.targetMinutes)) * 100);

  const rows = subtasks.length > 0 ? subtasks : [null];

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${category.color}22`, color: category.color }}
          >
            <Icon size={18} />
          </div>
          <div>
            <p className="font-display font-semibold text-ink text-sm">{category.name}</p>
            <p className="text-xs text-ink-faint">
              {formatMinutes(categoryMinutes)} / {formatMinutes(category.targetMinutes)}
            </p>
          </div>
        </div>
        <Badge tone={categoryPct >= 100 ? "success" : "accent"}>{Math.round(categoryPct)}%</Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <ProgressBar value={categoryPct} colorFrom={category.color} colorTo={category.color} className="mb-4" />

        <div className="space-y-2.5">
          {rows.map((sub) => {
            const isThisActive = timer.categoryId === category.id && timer.subtaskId === (sub?.id ?? null);
            const elapsed =
              isThisActive && timer.status === "running" && timer.segmentStartedAt
                ? timer.accumulatedSeconds + (now - timer.segmentStartedAt) / 1000
                : isThisActive
                ? timer.accumulatedSeconds
                : 0;

            const subMinutes = sub ? minutesFor(todaySessions, category.id, sub.id) : categoryMinutes;
            const subTarget = sub ? sub.targetMinutes : category.targetMinutes;
            const subPct = clampPercent((subMinutes / Math.max(1, subTarget)) * 100);

            return (
              <div
                key={sub?.id ?? "main"}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-base-soft/60 border border-border/40"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">{sub?.name ?? "Session"}</p>
                    <span className="text-xs text-ink-faint tabular shrink-0 ml-2">
                      {formatMinutes(subMinutes)} / {formatMinutes(subTarget)}
                    </span>
                  </div>
                  <ProgressBar value={subPct} height={6} colorFrom={category.color} colorTo={category.color} />
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isThisActive && timer.status !== "idle" && (
                    <span className="font-mono tabular text-xs text-ink-muted mr-1 hidden sm:inline">
                      {formatHMS(elapsed)}
                    </span>
                  )}
                  {isThisActive && timer.status === "running" ? (
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => pause()} title="Pause">
                      <Pause size={14} />
                    </Button>
                  ) : isThisActive && timer.status === "paused" ? (
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => resume()} title="Resume">
                      <Play size={14} />
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => start(category.id, sub?.id ?? null)}
                      title="Start"
                    >
                      <Play size={14} />
                    </Button>
                  )}
                  {isThisActive && timer.status !== "idle" && (
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-danger" onClick={() => stop()} title="Stop">
                      <Square size={13} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
