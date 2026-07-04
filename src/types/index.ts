// ============================================================
// Core domain types for Learning Time Tracker
// ============================================================

export type ThemeMode = "light" | "dark";

/** A top-level learning (or exercise) category, e.g. "Interview Preparation" */
export interface Category {
  id: string;
  name: string;
  /** target duration in minutes */
  targetMinutes: number;
  /** optional hard cap, e.g. Exercise can go up to 1h15m */
  maxMinutes?: number;
  color: string; // tailwind-friendly hsl token or hex
  icon: string; // lucide icon name
  order: number;
  /** Exercise is tracked separately from the "learning" daily goal */
  isLearning: boolean;
  isPinned?: boolean;
  createdAt: number;
  updatedAt: number;
}

/** A subtask that belongs to a category, e.g. "Revision" under Interview Prep */
export interface Subtask {
  id: string;
  categoryId: string;
  name: string;
  targetMinutes: number;
  order: number;
  createdAt: number;
  updatedAt: number;
}

/** A completed (or in-progress) block of tracked time */
export interface Session {
  id: string;
  categoryId: string;
  subtaskId: string | null;
  date: string; // YYYY-MM-DD (local)
  startTime: number; // epoch ms
  endTime: number; // epoch ms
  durationSeconds: number;
  notes: string;
  createdAt: number;
}

export type TimerStatus = "idle" | "running" | "paused";

/** The single global active timer. Only one can run at a time. */
export interface ActiveTimer {
  id: "active"; // singleton row
  categoryId: string | null;
  subtaskId: string | null;
  status: TimerStatus;
  /** epoch ms when the current running segment started (null if paused/idle) */
  segmentStartedAt: number | null;
  /** accumulated seconds from previous segments in this session */
  accumulatedSeconds: number;
  notes: string;
}

export interface NotificationTimes {
  waterReminderMinutes: number; // interval in minutes, 0 = off
  stretchReminderMinutes: number;
  exerciseReminderTime: string | null; // "HH:mm"
  interviewRevisionTime: string | null; // "HH:mm"
  goalRemainingAlertEnabled: boolean;
  goalCompletedAlertEnabled: boolean;
}

export interface AppSettings {
  id: "settings"; // singleton row
  dailyGoalMinutes: number;
  theme: ThemeMode;
  notifications: NotificationTimes;
  updatedAt: number;
}

export type AchievementId =
  | "streak-7"
  | "streak-30"
  | "hours-100"
  | "interview-master"
  | "learning-beast";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
}

export interface DayAggregate {
  date: string;
  totalMinutes: number;
  learningMinutes: number;
  exerciseMinutes: number;
  goalMinutes: number;
  completion: number; // 0-1
  status: "complete" | "partial" | "missed" | "future";
  categoryBreakdown: Record<string, number>; // categoryId -> minutes
}

export interface ProductivityBreakdown {
  score: number; // 0-100
  label: "Excellent" | "Good" | "Average" | "Needs Improvement";
  components: {
    goalCompletion: number;
    exercise: number;
    consistency: number;
    streak: number;
    missedPenalty: number;
    lateStartPenalty: number;
  };
}
