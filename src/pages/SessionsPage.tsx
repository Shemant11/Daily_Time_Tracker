import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCategories, useAllSubtasks, useSessions } from "@/hooks/useLiveData";
import { db } from "@/services/db";
import { formatMinutes } from "@/utils/time";

export default function SessionsPage() {
  const categories = useCategories() ?? [];
  const subtasks = useAllSubtasks() ?? [];
  const sessions = useSessions() ?? [];
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => {
      const cat = categories.find((c) => c.id === s.categoryId)?.name.toLowerCase() ?? "";
      const sub = subtasks.find((t) => t.id === s.subtaskId)?.name.toLowerCase() ?? "";
      const durationStr = `${Math.round(s.durationSeconds / 60)}`;
      return (
        s.date.includes(q) ||
        cat.includes(q) ||
        sub.includes(q) ||
        durationStr.includes(q) ||
        s.notes.toLowerCase().includes(q)
      );
    });
  }, [sessions, categories, subtasks, query]);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="font-display text-2xl font-bold">Sessions</h1>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <Input
          placeholder="Search by date, category, subtask, duration, or notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="divide-y divide-border/50">
        {filtered.length === 0 && <p className="p-6 text-sm text-ink-faint text-center">No sessions found.</p>}
        {filtered.map((s) => {
          const cat = categories.find((c) => c.id === s.categoryId);
          const sub = subtasks.find((t) => t.id === s.subtaskId);
          return (
            <div key={s.id} className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat?.color }} />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {cat?.name}
                    {sub ? ` · ${sub.name}` : ""}
                  </p>
                  <p className="text-xs text-ink-faint">
                    {format(s.startTime, "MMM d, yyyy · h:mm a")}
                    {s.notes ? ` — "${s.notes}"` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-medium tabular">{formatMinutes(s.durationSeconds / 60)}</span>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-danger" onClick={() => db.sessions.delete(s.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
