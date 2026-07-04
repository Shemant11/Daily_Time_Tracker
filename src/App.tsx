import { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ensureSeeded } from "@/services/db";
import { useTimerStore } from "@/store/useTimerStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useNotificationScheduler } from "@/hooks/useNotificationScheduler";
import { useTargetAlarm } from "@/hooks/useTargetAlarm";
import { AppSkeleton } from "@/components/AppSkeleton";
import { MainLayout } from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import CalendarPage from "@/pages/CalendarPage";
import Statistics from "@/pages/Statistics";
import SessionsPage from "@/pages/SessionsPage";
import ReportsPage from "@/pages/ReportsPage";
import AchievementsPage from "@/pages/AchievementsPage";
import SettingsPage from "@/pages/SettingsPage";

export default function App() {
  const [ready, setReady] = useState(false);
  const hydrateTimer = useTimerStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);

  useEffect(() => {
    (async () => {
      await ensureSeeded();
      await Promise.all([hydrateTimer(), hydrateSettings()]);
      setReady(true);
    })();
  }, [hydrateTimer, hydrateSettings]);

  useNotificationScheduler();
  useTargetAlarm();

  if (!ready) return <AppSkeleton />;

  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
