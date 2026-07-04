import * as RadixSwitch from "@radix-ui/react-switch";

export function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <RadixSwitch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="w-10 h-6 rounded-full bg-base-soft border border-border data-[state=checked]:bg-accent relative transition-colors outline-none"
    >
      <RadixSwitch.Thumb className="block w-4 h-4 bg-white rounded-full shadow translate-x-1 data-[state=checked]:translate-x-[1.15rem] transition-transform" />
    </RadixSwitch.Root>
  );
}
