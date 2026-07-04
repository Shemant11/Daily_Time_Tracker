import { useMemo } from "react";
import { Play, Pause, Square, Rocket } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useTimerStore } from "@/store/useTimerStore";
import { useTick } from "@/hooks/useTick";
import { formatHMS, formatMinutes, clampPercent } from "@/utils/time";
import type { Category, Subtask } from "@/types";

interface TimerHeroProps {
  categories: Category[];
  subtasks: Subtask[];
  learningCompletedMinutes: number;
  dailyGoalMinutes: number;
}

export function TimerHero({ categories, subtasks, learningCompletedMinutes, dailyGoalMinutes }: TimerHeroProps) {
  const { timer, pause, resume, stop } = useTimerStore();
  const isRunning = timer.status === "running";
  const now = useTick(1000, isRunning);

  const elapsed = useMemo(() => {
    if (timer.status === "running" && timer.segmentStartedAt) {
      return timer.accumulatedSeconds + (now - timer.segmentStartedAt) / 1000;
    }
    return timer.accumulatedSeconds;
  }, [timer, now]);

  const category = categories.find((c) => c.id === timer.categoryId);
  const subtask = subtasks.find((s) => s.id === timer.subtaskId);
  const overallPct = clampPercent((learningCompletedMinutes / Math.max(1, dailyGoalMinutes)) * 100);
  const remaining = Math.max(0, dailyGoalMinutes - learningCompletedMinutes);

  return (
    <Card className="p-6 flex flex-col lg:flex-row items-center gap-8">
      <ProgressRing value={overallPct} size={200} strokeWidth={12}>
        <div className="text-center">
          {timer.status !== "idle" ? (
            <>
              <p className="font-mono tabular text-3xl font-bold">{formatHMS(elapsed)}</p>
              <p className="text-xs text-ink-faint mt-1 max-w-[140px] truncate mx-auto">
                {category?.name}
                {subtask ? ` · ${subtask.name}` : ""}
              </p>
            </>
          ) : (
            <>
              <p className="font-display text-3xl font-bold">{Math.round(overallPct)}%</p>
              <p className="text-xs text-ink-faint mt-1">of daily goal</p>
            </>
          )}
        </div>
      </ProgressRing>

      <div className="flex-1 w-full">
        <p className="text-xs uppercase tracking-wide text-ink-faint font-medium mb-1">Current Session</p>
        <h2 className="font-display text-2xl font-bold mb-4">
          {timer.status === "idle" ? "No active session" : category?.name ?? "Session"}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs text-ink-faint">Completed today</p>
            <p className="font-semibold tabular">{formatMinutes(learningCompletedMinutes)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Remaining</p>
            <p className="font-semibold tabular">{formatMinutes(remaining)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {timer.status === "idle" && (
            <p className="text-sm text-ink-muted flex items-center gap-2">
              <Rocket size={16} className="text-accent" />
              Pick a category below to start learning
            </p>
          )}
          {timer.status === "running" && (
            <>
              <Button onClick={() => pause()} variant="secondary">
                <Pause size={16} /> Pause
              </Button>
              <Button onClick={() => stop()} variant="danger">
                <Square size={16} /> Stop
              </Button>
            </>
          )}
          {timer.status === "paused" && (
            <>
              <Button onClick={() => resume()}>
                <Play size={16} /> Resume
              </Button>
              <Button onClick={() => stop()} variant="danger">
                <Square size={16} /> Stop
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
