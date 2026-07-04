import Dexie, { type Table } from "dexie";
import { v4 as uuid } from "uuid";
import type {
  Category,
  Subtask,
  Session,
  ActiveTimer,
  AppSettings,
} from "@/types";

class LearningTrackerDB extends Dexie {
  categories!: Table<Category, string>;
  subtasks!: Table<Subtask, string>;
  sessions!: Table<Session, string>;
  activeTimer!: Table<ActiveTimer, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super("LearningTimeTrackerDB");
    this.version(1).stores({
      categories: "id, order, isLearning",
      subtasks: "id, categoryId, order",
      sessions: "id, date, categoryId, subtaskId, startTime",
      activeTimer: "id",
      settings: "id",
    });
  }
}

export const db = new LearningTrackerDB();

// ------------------------------------------------------------------
// Seeding — runs once, matches the spec's default categories/targets
// ------------------------------------------------------------------
export async function ensureSeeded() {
  const count = await db.categories.count();
  if (count > 0) return;

  const now = Date.now();

  const categories: Category[] = [
    {
      id: uuid(),
      name: "Interview Preparation",
      targetMinutes: 60,
      color: "#818CF8",
      icon: "BrainCircuit",
      order: 0,
      isLearning: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuid(),
      name: "Previous Skills",
      targetMinutes: 180,
      color: "#34D399",
      icon: "History",
      order: 1,
      isLearning: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuid(),
      name: "New Skills Learning",
      targetMinutes: 120,
      color: "#F59E0B",
      icon: "Sparkles",
      order: 2,
      isLearning: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuid(),
      name: "Exercise",
      targetMinutes: 60,
      maxMinutes: 75,
      color: "#FB7185",
      icon: "Dumbbell",
      order: 3,
      isLearning: false,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.categories.bulkAdd(categories);

  const [interview, previous, newSkills] = categories;

  const subtasks: Subtask[] = [
    // Interview Preparation
    { id: uuid(), categoryId: interview.id, name: "Revision", targetMinutes: 10, order: 0, createdAt: now, updatedAt: now },
    { id: uuid(), categoryId: interview.id, name: "Core Interview", targetMinutes: 30, order: 1, createdAt: now, updatedAt: now },
    { id: uuid(), categoryId: interview.id, name: "Quizzes / Mock Questions / Misc", targetMinutes: 20, order: 2, createdAt: now, updatedAt: now },
    // Previous Skills
    { id: uuid(), categoryId: previous.id, name: "Learning / Refresh", targetMinutes: 60, order: 0, createdAt: now, updatedAt: now },
    { id: uuid(), categoryId: previous.id, name: "Revision", targetMinutes: 20, order: 1, createdAt: now, updatedAt: now },
    { id: uuid(), categoryId: previous.id, name: "Practice", targetMinutes: 100, order: 2, createdAt: now, updatedAt: now },
    // New Skills Learning
    { id: uuid(), categoryId: newSkills.id, name: "Learning", targetMinutes: 100, order: 0, createdAt: now, updatedAt: now },
    { id: uuid(), categoryId: newSkills.id, name: "Revision", targetMinutes: 20, order: 1, createdAt: now, updatedAt: now },
  ];

  await db.subtasks.bulkAdd(subtasks);

  await db.activeTimer.put({
    id: "active",
    categoryId: null,
    subtaskId: null,
    status: "idle",
    segmentStartedAt: null,
    accumulatedSeconds: 0,
    notes: "",
  });

  await db.settings.put({
    id: "settings",
    dailyGoalMinutes: 360,
    theme: "dark",
    notifications: {
      waterReminderMinutes: 60,
      stretchReminderMinutes: 90,
      exerciseReminderTime: "18:00",
      interviewRevisionTime: "09:00",
      goalRemainingAlertEnabled: true,
      goalCompletedAlertEnabled: true,
    },
    updatedAt: now,
  });
}
