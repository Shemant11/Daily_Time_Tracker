import { useMemo } from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCategories, useSessions } from "@/hooks/useLiveData";
import { useSettingsStore } from "@/store/useSettingsStore";
import { aggregateRange } from "@/services/analytics";
import { buildReport } from "@/services/reports";
import { ReportCard } from "@/features/reports/ReportCard";
import { exportCSV, exportExcel, exportJSONBackup, importJSONBackup } from "@/services/exportService";
import { todayKey } from "@/utils/time";
import { Download, FileSpreadsheet, FileJson, Upload } from "lucide-react";

export default function ReportsPage() {
  const categories = useCategories() ?? [];
  const sessions = useSessions() ?? [];
  const { settings } = useSettingsStore();
  const dailyGoal = settings?.dailyGoalMinutes ?? 360;

  const today = todayKey();
  const weekDates = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  }).map((d) => todayKey(d));
  const monthDates = eachDayOfInterval({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }).map((d) =>
    todayKey(d)
  );

  const dailyReport = useMemo(() => {
    const agg = aggregateRange([today], sessions, categories, dailyGoal);
    const daySessions = sessions.filter((s) => s.date === today);
    return buildReport("Daily Report", format(new Date(), "EEEE, MMMM d, yyyy"), agg, daySessions, categories);
  }, [sessions, categories, dailyGoal, today]);

  const weeklyReport = useMemo(() => {
    const agg = aggregateRange(weekDates, sessions, categories, dailyGoal);
    const weekSessions = sessions.filter((s) => weekDates.includes(s.date));
    return buildReport(
      "Weekly Report",
      `${format(new Date(weekDates[0]), "MMM d")} – ${format(new Date(weekDates[weekDates.length - 1]), "MMM d, yyyy")}`,
      agg,
      weekSessions,
      categories
    );
  }, [sessions, categories, dailyGoal, weekDates]);

  const monthlyReport = useMemo(() => {
    const agg = aggregateRange(monthDates, sessions, categories, dailyGoal);
    const monthSessions = sessions.filter((s) => monthDates.includes(s.date));
    return buildReport("Monthly Report", format(new Date(), "MMMM yyyy"), agg, monthSessions, categories);
  }, [sessions, categories, dailyGoal, monthDates]);

  const fileInputId = "import-backup-input";

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold">Reports</h1>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={exportCSV}>
            <Download size={14} /> CSV
          </Button>
          <Button size="sm" variant="secondary" onClick={exportExcel}>
            <FileSpreadsheet size={14} /> Excel
          </Button>
          <Button size="sm" variant="secondary" onClick={exportJSONBackup}>
            <FileJson size={14} /> Backup
          </Button>
          <Button size="sm" variant="outline" onClick={() => document.getElementById(fileInputId)?.click()}>
            <Upload size={14} /> Import
          </Button>
          <input
            id={fileInputId}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importJSONBackup(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4">
          <ReportCard report={dailyReport} />
        </TabsContent>
        <TabsContent value="weekly" className="mt-4">
          <ReportCard report={weeklyReport} />
        </TabsContent>
        <TabsContent value="monthly" className="mt-4">
          <ReportCard report={monthlyReport} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="text-xs text-ink-faint">
          Backups export every category, subtask, session, and setting as JSON so you can restore your full history on
          another device.
        </CardContent>
      </Card>
    </div>
  );
}
