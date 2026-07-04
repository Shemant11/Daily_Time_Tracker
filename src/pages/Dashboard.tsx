import { useEffect, useMemo, useRef } from "react";
import { eachDayOfInterval, startOfWeek, startOfMonth, endOfWeek } from "date-fns";
import { Target, TrendingDown, Flame, CalendarRange, CalendarDays } from "lucide-react";
import { useCategories, useAllSubtasks, useSessions } from "@/hooks/useLiveData";
import { useSettingsStore } from "@/store/useSettingsStore";
import { StatCard } from "@/features/dashboard/StatCard";
import { TimerHero } from "@/features/dashboard/TimerHero";
import { CategoryCard } from "@/features/dashboard/CategoryCard";
import { QuickStart } from "@/features/dashboard/QuickStart";
import { TodayTimeline } from "@/features/dashboard/TodayTimeline";
import { ProductivityCard } from "@/features/dashboard/ProductivityCard";
import { aggregateDay, aggregateRange, computeStreaks, computeProductivityScore } from "@/services/analytics";
import { formatMinutes, todayKey } from "@/utils/time";
import { celebrateGoalCompleted } from "@/utils/celebrate";
import { notify } from "@/services/notifications";
import { playFanfare } from "@/utils/sound";

export default function Dashboard() {
  const categories = useCategories() ?? [];
  const subtasks = useAllSubtasks() ?? [];
  const sessions = useSessions() ?? [];
  const { settings } = useSettingsStore();
  const dailyGoal = settings?.dailyGoalMinutes ?? 360;
  const celebratedRef = useRef(false);
  const stopFanfareRef = useRef<(() => void) | null>(null);

  const today = todayKey();
  const todaySessions = useMemo(() => sessions.filter((s) => s.date === today), [sessions, today]);

  const todayAgg = useMemo(
    () => aggregateDay(today, sessions, categories, dailyGoal),
    [sessions, categories, dailyGoal, today]
  );

  const last30Dates = useMemo(
    () => eachDayOfInterval({ start: new Date(Date.now() - 29 * 86400000), end: new Date() }).map((d) => todayKey(d)),
    []
  );
  const last30Agg = useMemo(
    () => aggregateRange(last30Dates, sessions, categories, dailyGoal),
    [last30Dates, sessions, categories, dailyGoal]
  );
  const { current: currentStreak } = useMemo(() => computeStreaks(last30Agg), [last30Agg]);
  const last7Agg = last30Agg.slice(-7);

  const weekDates = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  }).map((d) => todayKey(d));
  const weeklyMinutes = useMemo(
    () => sessions.filter((s) => weekDates.includes(s.date)).reduce((sum, s) => sum + s.durationSeconds / 60, 0),
    [sessions, weekDates]
  );

  const monthStart = todayKey(startOfMonth(new Date()));
  const monthlyMinutes = useMemo(
    () => sessions.filter((s) => s.date >= monthStart && s.date <= today).reduce((sum, s) => sum + s.durationSeconds / 60, 0),
    [sessions, monthStart, today]
  );

  const exerciseCategory = categories.find((c) => !c.isLearning);
  const firstSessionHour = todaySessions.length
    ? new Date(Math.min(...todaySessions.map((s) => s.startTime))).getHours()
    : null;

  const productivity = useMemo(
    () =>
      computeProductivityScore(
        todayAgg,
        exerciseCategory?.targetMinutes ?? 60,
        currentStreak,
        last7Agg,
        firstSessionHour
      ),
    [todayAgg, exerciseCategory, currentStreak, last7Agg, firstSessionHour]
  );

  useEffect(() => {
    if (todayAgg.completion >= 1 && !celebratedRef.current) {
      celebratedRef.current = true;
      celebrateGoalCompleted();
      if (settings?.notifications.goalCompletedAlertEnabled) {
        stopFanfareRef.current = playFanfare();
        notify("Daily Goal Completed! 🎉", `You hit your ${formatMinutes(dailyGoal)} learning goal for today. Great work!`);
      }
    }
    if (todayAgg.completion < 1) celebratedRef.current = false;
  }, [todayAgg.completion, settings, dailyGoal]);

  useEffect(() => {
    return () => stopFanfareRef.current?.();
  }, []);

  const remaining = Math.max(0, dailyGoal - todayAgg.learningMinutes);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Today&apos;s Progress</h1>
          <p className="text-sm text-ink-faint">Stay disciplined. One session at a time.</p>
        </div>
      </div>

      <TimerHero
        categories={categories}
        subtasks={subtasks}
        learningCompletedMinutes={todayAgg.learningMinutes}
        dailyGoalMinutes={dailyGoal}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Daily Goal" value={formatMinutes(dailyGoal)} icon={Target} tone="accent" />
        <StatCard label="Remaining" value={formatMinutes(remaining)} icon={TrendingDown} tone="ember" />
        <StatCard label="Current Streak" value={`${currentStreak}d`} icon={Flame} tone="ember" sublabel="consecutive complete days" />
        <StatCard label="Weekly Hours" value={formatMinutes(weeklyMinutes)} icon={CalendarRange} tone="success" />
      </div>

      <QuickStart categories={categories} subtasks={subtasks} />

      <div>
        <h2 className="font-display text-lg font-semibold mb-3">Categories</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              subtasks={subtasks.filter((s) => s.categoryId === cat.id)}
              todaySessions={todaySessions}
            />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ProductivityCard breakdown={productivity} />
        <StatCard label="Monthly Hours" value={formatMinutes(monthlyMinutes)} icon={CalendarDays} tone="accent" />
      </div>

      <TodayTimeline sessions={todaySessions} categories={categories} subtasks={subtasks} />
    </div>
  );
}
