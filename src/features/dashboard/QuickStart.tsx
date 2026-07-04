import { Play, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTimerStore } from "@/store/useTimerStore";
import { resolveIcon } from "@/utils/icons";
import type { Category, Subtask } from "@/types";

export function QuickStart({ categories, subtasks }: { categories: Category[]; subtasks: Subtask[] }) {
  const { start } = useTimerStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap size={14} /> Quick Start
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = resolveIcon(cat.icon);
          const firstSub = subtasks.find((s) => s.categoryId === cat.id);
          return (
            <Button
              key={cat.id}
              variant="outline"
              size="sm"
              onClick={() => start(cat.id, firstSub?.id ?? null)}
              className="rounded-full"
              style={{ borderColor: `${cat.color}55` }}
            >
              <Icon size={14} style={{ color: cat.color }} />
              {cat.name}
              <Play size={11} className="opacity-60" />
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
