import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export const Select = RadixSelect.Root;

export function SelectTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <RadixSelect.Trigger
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-xl border border-border bg-base-soft px-3 text-sm",
        className
      )}
    >
      <RadixSelect.Value />
      <RadixSelect.Icon>
        <ChevronDown size={16} className="text-ink-faint" />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content className="z-50 glass rounded-xl p-1 shadow-glass">
        <RadixSelect.Viewport>{children}</RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <RadixSelect.Item
      value={value}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink cursor-pointer outline-none data-[highlighted]:bg-accent/15 data-[highlighted]:text-accent"
    >
      <RadixSelect.ItemIndicator>
        <Check size={14} />
      </RadixSelect.ItemIndicator>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}
