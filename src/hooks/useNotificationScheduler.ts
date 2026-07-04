import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useSettingsStore } from "@/store/useSettingsStore";
import { notify } from "@/services/notifications";

export function useNotificationScheduler() {
  const { settings } = useSettingsStore();
  const lastFiredRef = useRef<Record<string, string>>({});
  const sessionStartRef = useRef(Date.now());

  useEffect(() => {
    if (!settings) return;

    const interval = setInterval(() => {
      const { notifications } = settings;
      const now = new Date();
      const hhmm = format(now, "HH:mm");
      const minuteKey = format(now, "yyyy-MM-dd HH:mm");
      const elapsedMinutes = (Date.now() - sessionStartRef.current) / 60000;

      const fireOnce = (key: string, title: string, body: string) => {
        if (lastFiredRef.current[key] === minuteKey) return;
        lastFiredRef.current[key] = minuteKey;
        notify(title, body);
      };

      if (notifications.exerciseReminderTime === hhmm) {
        fireOnce("exercise", "Exercise Reminder 🏋️", "Time for your daily workout!");
      }
      if (notifications.interviewRevisionTime === hhmm) {
        fireOnce("interview", "Interview Revision Time 🧠", "A quick revision session keeps concepts fresh.");
      }
      if (
        notifications.waterReminderMinutes > 0 &&
        Math.floor(elapsedMinutes) > 0 &&
        Math.floor(elapsedMinutes) % notifications.waterReminderMinutes === 0
      ) {
        fireOnce(`water-${Math.floor(elapsedMinutes)}`, "Drink Water 💧", "Stay hydrated while you focus.");
      }
      if (
        notifications.stretchReminderMinutes > 0 &&
        Math.floor(elapsedMinutes) > 0 &&
        Math.floor(elapsedMinutes) % notifications.stretchReminderMinutes === 0
      ) {
        fireOnce(`stretch-${Math.floor(elapsedMinutes)}`, "Stretch Break 🧘", "Stand up and stretch for a minute.");
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [settings]);
}
