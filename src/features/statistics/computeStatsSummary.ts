import type { DayAggregate, Session } from "@/types";

export interface StatsSummary {
  averageDailyMinutes: number;
  longestSessionMinutes: number;
  mostProductiveDay: DayAggregate | null;
  leastProductiveDay: DayAggregate | null;
  totalHoursLearned: number;
}

export function computeStatsSummary(aggregates: DayAggregate[], sessions: Session[]): StatsSummary {
  const activeDays = aggregates.filter((d) => d.totalMinutes > 0);
  const averageDailyMinutes = activeDays.length
    ? activeDays.reduce((sum, d) => sum + d.learningMinutes, 0) / activeDays.length
    : 0;

  const longestSessionMinutes = sessions.length
    ? Math.max(...sessions.map((s) => s.durationSeconds / 60))
    : 0;

  const sortedByTotal = [...activeDays].sort((a, b) => b.totalMinutes - a.totalMinutes);
  const mostProductiveDay = sortedByTotal[0] ?? null;
  const leastProductiveDay = sortedByTotal.length ? sortedByTotal[sortedByTotal.length - 1] : null;

  const totalHoursLearned = sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 3600;

  return { averageDailyMinutes, longestSessionMinutes, mostProductiveDay, leastProductiveDay, totalHoursLearned };
}
