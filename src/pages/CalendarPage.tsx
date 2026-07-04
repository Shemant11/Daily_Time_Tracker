import { useMemo, useState } from "react";
import { addMonths, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MonthGrid } from "@/features/calendar/MonthGrid";
import { DayDetailDialog } from "@/features/calendar/DayDetailDialog";
import { useCategories, useSessions } from "@/hooks/useLiveData";
import { useSettingsStore } from "@/store/useSettingsStore";
import { aggregateRange } from "@/services/analytics";
import { todayKey } from "@/utils/time";

export default function CalendarPage() {
  const [anchor, setAnchor] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const categories = useCategories() ?? [];
  const sessions = useSessions() ?? [];
  const { settings } = useSettingsStore();
  const dailyGoal = settings?.dailyGoalMinutes ?? 360;

  const gridDates = useMemo(() => {
    const start = startOfWeek(startOfMonth(anchor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(anchor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end }).map((d) => todayKey(d));
  }, [anchor]);

  const aggregates = useMemo(() => {
    const list = aggregateRange(gridDates, sessions, categories, dailyGoal);
    return new Map(list.map((a) => [a.date, a]));
  }, [gridDates, sessions, categories, dailyGoal]);

  const selectedAggregate = selectedDay ? aggregates.get(selectedDay) : undefined;
  const selectedSessions = selectedDay ? sessions.filter((s) => s.date === selectedDay) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => setAnchor((d) => subMonths(d, 1))}>
            <ChevronLeft size={18} />
          </Button>
          <span className="font-medium w-32 text-center">{format(anchor, "MMMM yyyy")}</span>
          <Button size="icon" variant="ghost" onClick={() => setAnchor((d) => addMonths(d, 1))}>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      <Card className="p-5">
        <MonthGrid monthAnchor={anchor} aggregates={aggregates} onSelectDay={setSelectedDay} />
      </Card>

      <DayDetailDialog
        date={selectedDay}
        onClose={() => setSelectedDay(null)}
        aggregate={selectedAggregate}
        sessions={selectedSessions}
        categories={categories}
      />
    </div>
  );
}
