import { useMemo } from "react";
import { Moon, Sun, Pause, Play, Square, Timer } from "lucide-react";
import { useTimerStore } from "@/store/useTimerStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useCategories } from "@/hooks/useLiveData";
import { useTick } from "@/hooks/useTick";
import { formatHMS } from "@/utils/time";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { timer, pause, resume, stop } = useTimerStore();
  const { settings, setTheme } = useSettingsStore();
  const categories = useCategories();
  const isRunning = timer.status === "running";
  const now = useTick(1000, isRunning);

  const elapsed = useMemo(() => {
    if (timer.status === "running" && timer.segmentStartedAt) {
      return timer.accumulatedSeconds + (now - timer.segmentStartedAt) / 1000;
    }
    return timer.accumulatedSeconds;
  }, [timer, now]);

  const activeCategory = categories?.find((c) => c.id === timer.categoryId);

  return (
    <header className="h-16 shrink-0 border-b border-border/60 bg-base-soft/40 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {timer.status !== "idle" ? (
          <div className="flex items-center gap-3 rounded-full glass px-3 py-1.5 animate-fade-up">
            <span
              className={`w-2 h-2 rounded-full ${isRunning ? "bg-success animate-pulse" : "bg-ember"}`}
            />
            <Timer size={15} className="text-ink-muted" />
            <span className="text-sm font-medium text-ink-muted hidden sm:inline">
              {activeCategory?.name ?? "Session"}
            </span>
            <span className="font-mono tabular text-sm font-semibold">{formatHMS(elapsed)}</span>
            <div className="flex items-center gap-1 ml-1">
              {isRunning ? (
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => pause()} title="Pause">
                  <Pause size={14} />
                </Button>
              ) : (
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => resume()} title="Resume">
                  <Play size={14} />
                </Button>
              )}
              <Button size="icon" variant="ghost" className="h-7 w-7 text-danger" onClick={() => stop()} title="Stop">
                <Square size={13} />
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-faint">No timer running</p>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(settings?.theme === "light" ? "dark" : "light")}
        title="Toggle theme"
      >
        {settings?.theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </Button>
    </header>
  );
}
