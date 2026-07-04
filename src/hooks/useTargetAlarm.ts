import { useEffect, useRef } from "react";
import { useTimerStore } from "@/store/useTimerStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useCategories, useAllSubtasks } from "@/hooks/useLiveData";
import { useTick } from "@/hooks/useTick";
import { notify } from "@/services/notifications";
import { playChime } from "@/utils/sound";
import { formatMinutes } from "@/utils/time";

/**
 * Watches the single global active timer and, once, when its elapsed time
 * crosses the target duration for the category/subtask it's tracking, fires
 * a browser notification + chime. Resets whenever a new session starts.
 */
export function useTargetAlarm() {
  const { timer, getElapsedSeconds } = useTimerStore();
  const { settings } = useSettingsStore();
  const categories = useCategories() ?? [];
  const subtasks = useAllSubtasks() ?? [];

  const isRunning = timer.status === "running";
  const now = useTick(1000, isRunning);

  // Uniquely identifies "this" tracked session so we only alarm once per start.
  const sessionKey = `${timer.categoryId ?? ""}:${timer.subtaskId ?? ""}`;
  const firedRef = useRef<string | null>(null);
  const stopAlarmRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (timer.status !== "running") {
      stopAlarmRef.current?.();
      stopAlarmRef.current = null;
    }
    if (timer.status === "idle") {
      firedRef.current = null;
    }
  }, [timer.status]);

  useEffect(() => {
    return () => stopAlarmRef.current?.();
  }, []);

  useEffect(() => {
    if (timer.status !== "running" || !timer.categoryId) return;
    if (!settings?.notifications.goalCompletedAlertEnabled) return;
    if (firedRef.current === sessionKey) return;

    const category = categories.find((c) => c.id === timer.categoryId);
    const subtask = timer.subtaskId ? subtasks.find((s) => s.id === timer.subtaskId) : null;
    const targetMinutes = subtask?.targetMinutes ?? category?.targetMinutes;
    if (!targetMinutes) return;

    const elapsedMinutes = getElapsedSeconds(now) / 60;
    if (elapsedMinutes >= targetMinutes) {
      firedRef.current = sessionKey;
      stopAlarmRef.current = playChime();
      notify(
        "Target reached! 🎯",
        `${category?.name}${subtask ? ` · ${subtask.name}` : ""} — ${formatMinutes(targetMinutes)} target complete.`
      );
    }
  }, [now, timer, settings, categories, subtasks, sessionKey, getElapsedSeconds]);
}
