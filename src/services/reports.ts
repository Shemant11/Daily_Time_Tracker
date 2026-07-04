import type { Category, DayAggregate, Session } from "@/types";
import { formatMinutes } from "@/utils/time";

export interface ReportData {
  title: string;
  rangeLabel: string;
  totalMinutes: number;
  learningMinutes: number;
  exerciseMinutes: number;
  categoryBreakdown: { name: string; minutes: number }[];
  mostProductiveCategory: string | null;
  leastProductiveCategory: string | null;
  missedMinutes: number;
  suggestions: string[];
}

export function buildReport(
  title: string,
  rangeLabel: string,
  aggregates: DayAggregate[],
  sessions: Session[],
  categories: Category[]
): ReportData {
  const totalMinutes = aggregates.reduce((sum, d) => sum + d.totalMinutes, 0);
  const learningMinutes = aggregates.reduce((sum, d) => sum + d.learningMinutes, 0);
  const exerciseMinutes = aggregates.reduce((sum, d) => sum + d.exerciseMinutes, 0);
  const goalMinutes = aggregates.reduce((sum, d) => sum + d.goalMinutes, 0);
  const missedMinutes = Math.max(0, goalMinutes - learningMinutes);

  const breakdownMap: Record<string, number> = {};
  for (const s of sessions) {
    breakdownMap[s.categoryId] = (breakdownMap[s.categoryId] ?? 0) + s.durationSeconds / 60;
  }
  const categoryBreakdown = categories
    .map((c) => ({ name: c.name, minutes: breakdownMap[c.id] ?? 0 }))
    .filter((c) => c.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);

  const mostProductiveCategory = categoryBreakdown[0]?.name ?? null;
  const leastProductiveCategory =
    categoryBreakdown.length > 1 ? categoryBreakdown[categoryBreakdown.length - 1].name : null;

  const suggestions: string[] = [];
  const completeDays = aggregates.filter((d) => d.status === "complete").length;
  const missedDays = aggregates.filter((d) => d.status === "missed").length;

  if (missedMinutes > 0) {
    suggestions.push(`You're ${formatMinutes(missedMinutes)} short of your total goal — consider an extra short session tomorrow.`);
  }
  if (missedDays > 0) {
    suggestions.push(`${missedDays} day(s) had no learning activity logged. Try setting a fixed daily start time.`);
  }
  if (exerciseMinutes === 0) {
    suggestions.push("No exercise logged in this period — even a short walk counts toward the target.");
  }
  if (completeDays === aggregates.length && aggregates.length > 0) {
    suggestions.push("Perfect completion rate! Consider raising your daily goal to keep growing.");
  }
  if (leastProductiveCategory) {
    suggestions.push(`"${leastProductiveCategory}" is getting the least attention — consider rebalancing your schedule.`);
  }

  return {
    title,
    rangeLabel,
    totalMinutes,
    learningMinutes,
    exerciseMinutes,
    categoryBreakdown,
    mostProductiveCategory,
    leastProductiveCategory,
    missedMinutes,
    suggestions,
  };
}
