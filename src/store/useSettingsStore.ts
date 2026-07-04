import { create } from "zustand";
import { db } from "@/services/db";
import type { AppSettings, ThemeMode } from "@/types";

interface SettingsState {
  settings: AppSettings | null;
  hydrate: () => Promise<void>;
  setDailyGoal: (minutes: number) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  updateNotifications: (partial: Partial<AppSettings["notifications"]>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,

  hydrate: async () => {
    const s = await db.settings.get("settings");
    if (s) {
      set({ settings: s });
      document.documentElement.classList.toggle("light", s.theme === "light");
    }
  },

  setDailyGoal: async (minutes) => {
    const current = get().settings;
    if (!current) return;
    const next = { ...current, dailyGoalMinutes: minutes, updatedAt: Date.now() };
    set({ settings: next });
    await db.settings.put(next);
  },

  setTheme: async (theme) => {
    const current = get().settings;
    if (!current) return;
    const next = { ...current, theme, updatedAt: Date.now() };
    set({ settings: next });
    document.documentElement.classList.toggle("light", theme === "light");
    await db.settings.put(next);
  },

  updateNotifications: async (partial) => {
    const current = get().settings;
    if (!current) return;
    const next = {
      ...current,
      notifications: { ...current.notifications, ...partial },
      updatedAt: Date.now(),
    };
    set({ settings: next });
    await db.settings.put(next);
  },
}));
