import { useState } from "react";
import { Pencil, Moon, Sun, Bell, Target, Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { useCategories, useAllSubtasks } from "@/hooks/useLiveData";
import { useSettingsStore } from "@/store/useSettingsStore";
import { EditCategoryDialog } from "@/features/settings/EditCategoryDialog";
import { EditSubtaskDialog } from "@/features/settings/EditSubtaskDialog";
import { AddCategoryDialog } from "@/features/settings/AddCategoryDialog";
import { AddSubtaskDialog } from "@/features/settings/AddSubtaskDialog";
import { resolveIcon } from "@/utils/icons";
import { formatMinutes } from "@/utils/time";
import { requestNotificationPermission } from "@/services/notifications";
import { db } from "@/services/db";
import type { Category, Subtask } from "@/types";

export default function SettingsPage() {
  const categories = useCategories() ?? [];
  const subtasks = useAllSubtasks() ?? [];
  const { settings, setDailyGoal, setTheme, updateNotifications } = useSettingsStore();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addSubtaskForCategory, setAddSubtaskForCategory] = useState<string | null>(null);
  const [goalInput, setGoalInput] = useState(settings?.dailyGoalMinutes ?? 360);

  if (!settings) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={14} /> Daily Learning Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex items-end gap-3">
          <div className="flex-1">
            <Label>Minutes per day (current: {formatMinutes(settings.dailyGoalMinutes)})</Label>
            <Input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(Number(e.target.value))}
            />
          </div>
          <Button onClick={() => setDailyGoal(goalInput)}>Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories & Subtasks</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {categories.map((cat) => {
            const Icon = resolveIcon(cat.icon);
            const catSubtasks = subtasks.filter((s) => s.categoryId === cat.id);
            return (
              <div key={cat.id} className="rounded-xl border border-border/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{cat.name}</p>
                      <p className="text-xs text-ink-faint">Target: {formatMinutes(cat.targetMinutes)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setEditingCategory(cat)}>
                      <Pencil size={13} /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-danger"
                      onClick={() => {
                        if (confirm(`Delete "${cat.name}" and all its subtasks? Existing sessions stay in your history.`)) {
                          db.subtasks.where("categoryId").equals(cat.id).delete();
                          db.categories.delete(cat.id);
                        }
                      }}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>

                {catSubtasks.length > 0 && (
                  <div className="pl-10 space-y-1.5 mb-2">
                    {catSubtasks.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between text-sm">
                        <span className="text-ink-muted">
                          {sub.name} — {formatMinutes(sub.targetMinutes)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setEditingSubtask(sub)}>
                            <Pencil size={12} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-danger"
                            onClick={() => {
                              if (confirm(`Delete subtask "${sub.name}"?`)) db.subtasks.delete(sub.id);
                            }}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pl-10">
                  <Button size="sm" variant="outline" onClick={() => setAddSubtaskForCategory(cat.id)}>
                    <Plus size={13} /> Add Subtask
                  </Button>
                </div>
              </div>
            );
          })}

          <Button variant="secondary" className="w-full" onClick={() => setAddCategoryOpen(true)}>
            <Plus size={15} /> Add Category
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={14} /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <Button size="sm" variant="secondary" onClick={requestNotificationPermission}>
            Enable Browser Notifications
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Water reminder</p>
              <p className="text-xs text-ink-faint">Every {settings.notifications.waterReminderMinutes} min</p>
            </div>
            <Input
              type="number"
              className="w-24"
              value={settings.notifications.waterReminderMinutes}
              onChange={(e) => updateNotifications({ waterReminderMinutes: Number(e.target.value) })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Stretch reminder</p>
              <p className="text-xs text-ink-faint">Every {settings.notifications.stretchReminderMinutes} min</p>
            </div>
            <Input
              type="number"
              className="w-24"
              value={settings.notifications.stretchReminderMinutes}
              onChange={(e) => updateNotifications({ stretchReminderMinutes: Number(e.target.value) })}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Exercise reminder time</p>
            <Input
              type="time"
              className="w-32"
              value={settings.notifications.exerciseReminderTime ?? ""}
              onChange={(e) => updateNotifications({ exerciseReminderTime: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Interview revision time</p>
            <Input
              type="time"
              className="w-32"
              value={settings.notifications.interviewRevisionTime ?? ""}
              onChange={(e) => updateNotifications({ interviewRevisionTime: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Target & goal alarms</p>
              <p className="text-xs text-ink-faint">Chime + notification when a timer hits its target, and when the daily goal is completed</p>
            </div>
            <Switch
              checked={settings.notifications.goalCompletedAlertEnabled}
              onCheckedChange={(v) => updateNotifications({ goalCompletedAlertEnabled: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex items-center justify-between">
          <p className="text-sm">Theme</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={settings.theme === "light" ? "primary" : "outline"}
              onClick={() => setTheme("light")}
            >
              <Sun size={14} /> Light
            </Button>
            <Button
              size="sm"
              variant={settings.theme === "dark" ? "primary" : "outline"}
              onClick={() => setTheme("dark")}
            >
              <Moon size={14} /> Dark
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditCategoryDialog category={editingCategory} open={!!editingCategory} onOpenChange={(o) => !o && setEditingCategory(null)} />
      <EditSubtaskDialog subtask={editingSubtask} open={!!editingSubtask} onOpenChange={(o) => !o && setEditingSubtask(null)} />
      <AddCategoryDialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen} nextOrder={categories.length} />
      <AddSubtaskDialog
        categoryId={addSubtaskForCategory}
        open={!!addSubtaskForCategory}
        onOpenChange={(o) => !o && setAddSubtaskForCategory(null)}
        nextOrder={subtasks.filter((s) => s.categoryId === addSubtaskForCategory).length}
      />
    </div>
  );
}
