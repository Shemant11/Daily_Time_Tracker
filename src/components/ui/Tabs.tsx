import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "@/utils/cn";

export const Tabs = RadixTabs.Root;

export function TabsList({ className, ...props }: React.ComponentProps<typeof RadixTabs.List>) {
  return (
    <RadixTabs.List
      className={cn("inline-flex items-center gap-1 rounded-xl bg-base-soft border border-border p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      className={cn(
        "rounded-lg px-3.5 py-1.5 text-sm font-medium text-ink-muted transition-colors data-[state=active]:bg-accent data-[state=active]:text-white",
        className
      )}
      {...props}
    />
  );
}

export const TabsContent = RadixTabs.Content;
