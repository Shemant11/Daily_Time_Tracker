import { useMemo } from "react";
import { eachDayOfInterval, subDays } from "date-fns";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useCategories, useSessions } from "@/hooks/useLiveData";
import { useSettingsStore } from "@/store/useSettingsStore";
import { aggregateRange, computeStreaks } from "@/services/analytics";
import { computeAchievements } from "@/services/achievements";
import { todayKey } from "@/utils/time";
import { cn } from "@/utils/cn";

export default function AchievementsPage() {
  const categories = useCategories() ?? [];
  const sessions = useSessions() ?? [];
  const { settings } = useSettingsStore();
  const dailyGoal = settings?.dailyGoalMinutes ?? 360;

  const dates = useMemo(
    () => eachDayOfInterval({ start: subDays(new Date(), 119), end: new Date() }).map((d) => todayKey(d)),
    []
  );
  const aggregates = useMemo(() => aggregateRange(dates, sessions, categories, dailyGoal), [dates, sessions, categories, dailyGoal]);
  const { current, longest } = useMemo(() => computeStreaks(aggregates), [aggregates]);
  const achievements = useMemo(
    () => computeAchievements(aggregates, sessions, categories, current, longest),
    [aggregates, sessions, categories, current, longest]
  );

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="font-display text-2xl font-bold">Achievements</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {achievements.map((a) => (
          <Card
            key={a.id}
            className={cn(
              "p-5 flex items-start gap-4 transition-opacity",
              !a.unlockedAt && "opacity-50 grayscale"
            )}
          >
            <div className="text-3xl">{a.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-display font-semibold">{a.title}</p>
                {a.unlockedAt && <Badge tone="success">Unlocked</Badge>}
              </div>
              <p className="text-sm text-ink-faint mt-1">{a.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
