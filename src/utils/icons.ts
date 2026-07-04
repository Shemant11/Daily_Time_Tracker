import {
  BrainCircuit,
  History,
  Sparkles,
  Dumbbell,
  BookOpen,
  Target,
  Flame,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  BrainCircuit,
  History,
  Sparkles,
  Dumbbell,
  BookOpen,
  Target,
  Flame,
  Trophy,
};

export function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? Target;
}
