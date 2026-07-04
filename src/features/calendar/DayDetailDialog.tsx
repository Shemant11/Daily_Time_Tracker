import { format } from "date-fns";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { formatMinutes } from "@/utils/time";
import type { Category, DayAggregate, Session } from "@/types";

export function DayDetailDialog({
  date,
  onClose,
  aggregate,
  sessions,
  categories,
}: {
  date: string | null;
  onClose: () => void;
  aggregate: DayAggregate | undefined;
  sessions: Session[];
  categories: Category[];
}) {
  return (
    <Dialog open={!!date} onOpenChange={(open) => !open && onClose()}>
      {date && (
        <DialogContent title={format(new Date(date), "EEEE, MMMM d")}>
          {aggregate ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-ink-faint">Total</p>
                  <p className="font-semibold tabular">{formatMinutes(aggregate.totalMinutes)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-faint">Goal</p>
                  <p className="font-semibold tabular">{formatMinutes(aggregate.goalMinutes)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-faint">Completion</p>
                  <p className="font-semibold tabular">{Math.round(aggregate.completion * 100)}%</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-ink-faint font-medium mb-2">Category breakdown</p>
                <div className="space-y-1.5">
                  {Object.entries(aggregate.categoryBreakdown).map(([catId, minutes]) => {
                    const cat = categories.find((c) => c.id === catId);
                    return (
                      <div key={catId} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color }} />
                          {cat?.name ?? "Unknown"}
                        </span>
                        <span className="tabular text-ink-muted">{formatMinutes(minutes)}</span>
                      </div>
                    );
                  })}
                  {Object.keys(aggregate.categoryBreakdown).length === 0 && (
                    <p className="text-sm text-ink-faint">No sessions this day.</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-ink-faint font-medium mb-2">Sessions</p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {sessions.map((s) => {
                    const cat = categories.find((c) => c.id === s.categoryId);
                    return (
                      <div key={s.id} className="flex items-center justify-between text-xs text-ink-muted">
                        <span>
                          {cat?.name} · {format(s.startTime, "h:mm a")}
                        </span>
                        <span className="tabular">{formatMinutes(s.durationSeconds / 60)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-faint">No data for this day.</p>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
