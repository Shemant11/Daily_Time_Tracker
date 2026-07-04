import { differenceInCalendarDays, format, parseISO } from "date-fns";
import type { Category, DayAggregate, ProductivityBreakdown, Session } from "@/types";
import { clampPercent, todayKey } from "@/utils/time";

/** Aggregates all sessions for a single calendar day into totals + per-category breakdown. */
export function aggregateDay(
  date: string,
  sessions: Session[],
  categories: Category[],
  dailyGoalMinutes: number
): DayAggregate {
  const daySessions = sessions.filter((s) => s.date === date);
  const categoryBreakdown: Record<string, number> = {};
  let learningMinutes = 0;
  let exerciseMinutes = 0;

  for (const s of daySessions) {
    const minutes = s.durationSeconds / 60;
    categoryBreakdown[s.categoryId] = (categoryBreakdown[s.categoryId] ?? 0) + minutes;
    const cat = categories.find((c) => c.id === s.categoryId);
    if (cat?.isLearning) learningMinutes += minutes;
    else exerciseMinutes += minutes;
  }

  const totalMinutes = learningMinutes + exerciseMinutes;
  const completion = dailyGoalMinutes > 0 ? clampPercent((learningMinutes / dailyGoalMinutes) * 100) / 100 : 0;

  const isToday = date === todayKey();
  const isFuture = differenceInCalendarDays(parseISO(date), new Date()) > 0;

  let status: DayAggregate["status"];
  if (isFuture) status = "future";
  else if (completion >= 1) status = "complete";
  else if (completion > 0) status = "partial";
  else status = isToday ? "partial" : "missed";

  return {
    date,
    totalMinutes,
    learningMinutes,
    exerciseMinutes,
    goalMinutes: dailyGoalMinutes,
    completion,
    status,
    categoryBreakdown,
  };
}

export function aggregateRange(
  dates: string[],
  sessions: Session[],
  categories: Category[],
  dailyGoalMinutes: number
): DayAggregate[] {
  return dates.map((d) => aggregateDay(d, sessions, categories, dailyGoalMinutes));
}

/** Current streak = consecutive complete days ending today (or yesterday if today isn't done yet). */
export function computeStreaks(sortedAggregates: DayAggregate[]): { current: number; longest: number } {
  // sortedAggregates must be in ascending date order, only past + today
  let longest = 0;
  let running = 0;
  for (const day of sortedAggregates) {
    if (day.status === "complete") {
      running += 1;
      longest = Math.max(longest, running);
    } else if (day.status !== "future") {
      running = 0;
    }
  }

  // current streak: walk backwards from the end
  let current = 0;
  for (let i = sortedAggregates.length - 1; i >= 0; i--) {
    const day = sortedAggregates[i];
    if (day.status === "complete") {
      current += 1;
    } else if (day.date === todayKey() && day.status === "partial") {
      // today not finished yet — doesn't break the streak, just doesn't count yet
      continue;
    } else {
      break;
    }
  }

  return { current, longest };
}

export function computeProductivityScore(
  today: DayAggregate,
  exerciseTargetMinutes: number,
  currentStreak: number,
  last7Days: DayAggregate[],
  firstSessionStartHour: number | null
): ProductivityBreakdown {
  const goalCompletion = clampPercent(today.completion * 100) * 0.4; // up to 40 pts
  const exerciseRatio = exerciseTargetMinutes > 0 ? clampPercent((today.exerciseMinutes / exerciseTargetMinutes) * 100) / 100 : 0;
  const exercise = exerciseRatio * 20; // up to 20 pts

  const activeDays = last7Days.filter((d) => d.status === "complete" || d.status === "partial").length;
  const consistency = (activeDays / 7) * 20; // up to 20 pts

  const streakScore = Math.min(1, currentStreak / 14) * 15; // up to 15 pts, caps at 14-day streak

  const missedInWeek = last7Days.filter((d) => d.status === "missed").length;
  const missedPenalty = -Math.min(15, missedInWeek * 3);

  let lateStartPenalty = 0;
  if (firstSessionStartHour !== null && firstSessionStartHour >= 12) {
    lateStartPenalty = -5;
  }

  const raw = goalCompletion + exercise + consistency + streakScore + missedPenalty + lateStartPenalty;
  const score = Math.round(clampPercent(raw));

  let label: ProductivityBreakdown["label"];
  if (score >= 85) label = "Excellent";
  else if (score >= 65) label = "Good";
  else if (score >= 40) label = "Average";
  else label = "Needs Improvement";

  return {
    score,
    label,
    components: {
      goalCompletion: Math.round(goalCompletion),
      exercise: Math.round(exercise),
      consistency: Math.round(consistency),
      streak: Math.round(streakScore),
      missedPenalty,
      lateStartPenalty,
    },
  };
}

export function formatDateLabel(dateKey: string) {
  return format(parseISO(dateKey), "MMM d");
}
