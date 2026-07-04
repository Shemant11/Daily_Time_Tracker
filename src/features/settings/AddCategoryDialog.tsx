import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { db } from "@/services/db";
import { useController, Control } from "react-hook-form";

const COLOR_OPTIONS = ["#818CF8", "#34D399", "#F59E0B", "#FB7185", "#22D3EE", "#C084FC", "#F472B6", "#A3E635"];

const schema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  targetMinutes: z.coerce.number().min(1, "Must be at least 1 minute").max(1440),
  color: z.string(),
  isLearning: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function ColorPicker({ control }: { control: Control<FormValues> }) {
  const { field } = useController({ name: "color", control });
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_OPTIONS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => field.onChange(color)}
          className="w-7 h-7 rounded-full transition-transform"
          style={{
            backgroundColor: color,
            outline: field.value === color ? "2px solid white" : "none",
            outlineOffset: 2,
            transform: field.value === color ? "scale(1.15)" : "scale(1)",
          }}
        />
      ))}
    </div>
  );
}

function LearningToggle({ control }: { control: Control<FormValues> }) {
  const { field } = useController({ name: "isLearning", control });
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label className="mb-0">Counts toward daily learning goal</Label>
        <p className="text-xs text-ink-faint">Turn off for categories tracked separately, like Exercise</p>
      </div>
      <Switch checked={field.value} onCheckedChange={field.onChange} />
    </div>
  );
}

export function AddCategoryDialog({ open, onOpenChange, nextOrder }: { open: boolean; onOpenChange: (o: boolean) => void; nextOrder: number }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", targetMinutes: 30, color: COLOR_OPTIONS[0], isLearning: true },
  });

  const onSubmit = async (values: FormValues) => {
    const now = Date.now();
    await db.categories.add({
      id: uuid(),
      name: values.name,
      targetMinutes: values.targetMinutes,
      color: values.color,
      icon: "Target",
      order: nextOrder,
      isLearning: values.isLearning,
      createdAt: now,
      updatedAt: now,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <DialogContent title="Add Category">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input placeholder="e.g. System Design" {...register("name")} />
              {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Target (minutes)</Label>
              <Input type="number" {...register("targetMinutes")} />
              {errors.targetMinutes && <p className="text-xs text-danger mt-1">{errors.targetMinutes.message}</p>}
            </div>
            <div>
              <Label>Color</Label>
              <ColorPicker control={control} />
            </div>
            <LearningToggle control={control} />
            <Button type="submit" className="w-full">
              Add Category
            </Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
