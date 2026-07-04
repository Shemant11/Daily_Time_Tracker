import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;

export function DialogContent({
  className,
  children,
  title,
}: {
  className?: string;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in" />
      <RadixDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 glass rounded-2xl p-6 shadow-glass",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <RadixDialog.Title className="font-display text-lg font-semibold">{title}</RadixDialog.Title>
          <RadixDialog.Close className="text-ink-faint hover:text-ink rounded-lg p-1">
            <X size={18} />
          </RadixDialog.Close>
        </div>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
