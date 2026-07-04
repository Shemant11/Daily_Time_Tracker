import { useMemo } from "react";
import { eachDayOfInterval, subDays } from "date-fns";
import { Clock, Flame, Trophy, TrendingUp, TrendingDown, Hourglass } from "lucide-react";
import { useCategories, useSessions } from "@/hooks/useLiveData";
import { useSettingsStore } from "@/store/useSettingsStore";
import { StatCard } from "@/features/dashboard/StatCard";
import { DailyHoursChart } from "@/features/statistics/DailyHoursChart";
import { DistributionPie } from "@/features/statistics/DistributionPie";
import { ExerciseTrendChart } from "@/features/statistics/ExerciseTrendChart";
import { LearningHeatmap } from "@/features/statistics/LearningHeatmap";
import { computeStatsSummary } from "@/features/statistics/computeStatsSummary";
import { aggregateRange, computeStreaks, formatDateLabel } from "@/services/analytics";
import { formatMinutes, todayKey } from "@/utils/time";

export default function Statistics() {
  const categories = useCategories() ?? [];
  const sessions = useSessions() ?? [];
  const { settings } = useSettingsStore();
  const dailyGoal = settings?.dailyGoalMinutes ?? 360;

  const last14Dates = useMemo(
    () => eachDayOfInterval({ start: subDays(new Date(), 13), end: new Date() }).map((d) => todayKey(d)),
    []
  );
  const last120Dates = useMemo(
    () => eachDayOfInterval({ start: subDays(new Date(), 119), end: new Date() }).map((d) => todayKey(d)),
    []
  );

  const last14Agg = useMemo(() => aggregateRange(last14Dates, sessions, categories, dailyGoal), [last14Dates, sessions, categories, dailyGoal]);
  const last120Agg = useMemo(() => aggregateRange(last120Dates, sessions, categories, dailyGoal), [last120Dates, sessions, categories, dailyGoal]);
  const heatmapMap = useMemo(() => new Map(last120Agg.map((a) => [a.date, a])), [last120Agg]);

  const { current, longest } = useMemo(() => computeStreaks(last120Agg), [last120Agg]);
  const summary = useMemo(() => computeStatsSummary(last120Agg, sessions), [last120Agg, sessions]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold">Statistics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Hours Learned" value={`${summary.totalHoursLearned.toFixed(1)}h`} icon={Hourglass} />
        <StatCard label="Avg Daily Hours" value={formatMinutes(summary.averageDailyMinutes)} icon={Clock} />
        <StatCard label="Current Streak" value={`${current}d`} icon={Flame} tone="ember" />
        <StatCard label="Longest Streak" value={`${longest}d`} icon={Trophy} tone="success" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Longest Session"
          value={formatMinutes(summary.longestSessionMinutes)}
          icon={Clock}
        />
        <StatCard
          label="Most Productive Day"
          value={summary.mostProductiveDay ? formatDateLabel(summary.mostProductiveDay.date) : "—"}
          sublabel={summary.mostProductiveDay ? formatMinutes(summary.mostProductiveDay.totalMinutes) : undefined}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Least Productive Day"
          value={summary.leastProductiveDay ? formatDateLabel(summary.leastProductiveDay.date) : "—"}
          sublabel={summary.leastProductiveDay ? formatMinutes(summary.leastProductiveDay.totalMinutes) : undefined}
          icon={TrendingDown}
          tone="danger"
        />
        <StatCard label="Weekly Avg" value={formatMinutes(summary.averageDailyMinutes * 7)} icon={Clock} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <DailyHoursChart data={last14Agg} title="Daily Hours (Last 14 Days)" />
        <DistributionPie sessions={sessions} categories={categories} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ExerciseTrendChart data={last14Agg} />
        <LearningHeatmap aggregates={heatmapMap} />
      </div>
    </div>
  );
}
