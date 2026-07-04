import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { db } from "@/services/db";
import type { ActiveTimer, TimerStatus } from "@/types";
import { todayKey } from "@/utils/time";

interface TimerState {
  timer: ActiveTimer;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  start: (categoryId: string, subtaskId: string | null) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  /** Stops the timer, writes a Session row, and resets to idle. Returns the elapsed seconds. */
  stop: (notes?: string) => Promise<number>;
  reset: () => Promise<void>;
  /** Live elapsed seconds for the current segment + accumulated. Call with Date.now(). */
  getElapsedSeconds: (now: number) => number;
}

const IDLE: ActiveTimer = {
  id: "active",
  categoryId: null,
  subtaskId: null,
  status: "idle",
  segmentStartedAt: null,
  accumulatedSeconds: 0,
  notes: "",
};

async function persist(timer: ActiveTimer) {
  await db.activeTimer.put(timer);
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timer: IDLE,
  hydrated: false,

  hydrate: async () => {
    const existing = await db.activeTimer.get("active");
    set({ timer: existing ?? IDLE, hydrated: true });
  },

  start: async (categoryId, subtaskId) => {
    const { timer, stop } = get();
    // Only one timer may run at a time — auto-pause/finalize the previous one.
    if (timer.status !== "idle" && (timer.categoryId !== categoryId || timer.subtaskId !== subtaskId)) {
      await stop();
    }
    const next: ActiveTimer = {
      id: "active",
      categoryId,
      subtaskId,
      status: "running",
      segmentStartedAt: Date.now(),
      accumulatedSeconds: 0,
      notes: "",
    };
    set({ timer: next });
    await persist(next);
  },

  pause: async () => {
    const { timer } = get();
    if (timer.status !== "running" || !timer.segmentStartedAt) return;
    const elapsed = (Date.now() - timer.segmentStartedAt) / 1000;
    const next: ActiveTimer = {
      ...timer,
      status: "paused" as TimerStatus,
      segmentStartedAt: null,
      accumulatedSeconds: timer.accumulatedSeconds + elapsed,
    };
    set({ timer: next });
    await persist(next);
  },

  resume: async () => {
    const { timer } = get();
    if (timer.status !== "paused") return;
    const next: ActiveTimer = {
      ...timer,
      status: "running",
      segmentStartedAt: Date.now(),
    };
    set({ timer: next });
    await persist(next);
  },

  stop: async (notes = "") => {
    const { timer } = get();
    if (timer.status === "idle" || !timer.categoryId) return 0;

    let totalSeconds = timer.accumulatedSeconds;
    const startedAt = timer.segmentStartedAt;
    if (timer.status === "running" && startedAt) {
      totalSeconds += (Date.now() - startedAt) / 1000;
    }
    totalSeconds = Math.round(totalSeconds);

    if (totalSeconds >= 1) {
      const endTime = Date.now();
      const startTime = endTime - totalSeconds * 1000;
      await db.sessions.add({
        id: uuid(),
        categoryId: timer.categoryId,
        subtaskId: timer.subtaskId,
        date: todayKey(new Date(startTime)),
        startTime,
        endTime,
        durationSeconds: totalSeconds,
        notes: notes || timer.notes || "",
        createdAt: Date.now(),
      });
    }

    set({ timer: IDLE });
    await persist(IDLE);
    return totalSeconds;
  },

  reset: async () => {
    set({ timer: IDLE });
    await persist(IDLE);
  },

  getElapsedSeconds: (now: number) => {
    const { timer } = get();
    if (timer.status === "running" && timer.segmentStartedAt) {
      return timer.accumulatedSeconds + (now - timer.segmentStartedAt) / 1000;
    }
    return timer.accumulatedSeconds;
  },
}));
