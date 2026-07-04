import type { Achievement, Category, DayAggregate, Session } from "@/types";

const DEFINITIONS: Omit<Achievement, "unlockedAt">[] = [
  { id: "streak-7", title: "7 Day Streak", description: "Complete your daily goal 7 days in a row.", icon: "🔥" },
  { id: "streak-30", title: "30 Day Streak", description: "Complete your daily goal 30 days in a row.", icon: "🏆" },
  { id: "hours-100", title: "100 Hours Learned", description: "Accumulate 100 total hours of learning.", icon: "💎" },
  { id: "interview-master", title: "Interview Master", description: "Log 20 hours in Interview Preparation.", icon: "🎯" },
  { id: "learning-beast", title: "Learning Beast", description: "Complete your daily goal 5 days in a single week.", icon: "📚" },
];

export function computeAchievements(
  aggregates: DayAggregate[],
  sessions: Session[],
  categories: Category[],
  currentStreak: number,
  longestStreak: number
): Achievement[] {
  const totalHours = sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 3600;
  const interviewCategory = categories.find((c) => c.name.toLowerCase().includes("interview"));
  const interviewHours = interviewCategory
    ? sessions.filter((s) => s.categoryId === interviewCategory.id).reduce((sum, s) => sum + s.durationSeconds, 0) / 3600
    : 0;

  const last7 = aggregates.slice(-7);
  const completeInLast7 = last7.filter((d) => d.status === "complete").length;

  const unlocked: Record<string, boolean> = {
    "streak-7": longestStreak >= 7 || currentStreak >= 7,
    "streak-30": longestStreak >= 30 || currentStreak >= 30,
    "hours-100": totalHours >= 100,
    "interview-master": interviewHours >= 20,
    "learning-beast": completeInLast7 >= 5,
  };

  return DEFINITIONS.map((d) => ({
    ...d,
    unlockedAt: unlocked[d.id] ? Date.now() : null,
  }));
}
