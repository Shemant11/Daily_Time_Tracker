import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { db } from "@/services/db";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  targetMinutes: z.coerce.number().min(1, "Must be at least 1 minute").max(600),
});

type FormValues = z.infer<typeof schema>;

export function AddSubtaskDialog({
  categoryId,
  open,
  onOpenChange,
  nextOrder,
}: {
  categoryId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextOrder: number;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", targetMinutes: 15 } });

  const onSubmit = async (values: FormValues) => {
    if (!categoryId) return;
    const now = Date.now();
    await db.subtasks.add({
      id: uuid(),
      categoryId,
      name: values.name,
      targetMinutes: values.targetMinutes,
      order: nextOrder,
      createdAt: now,
      updatedAt: now,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && categoryId && (
        <DialogContent title="Add Subtask">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Subtask Name</Label>
              <Input placeholder="e.g. Flashcards" {...register("name")} />
              {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Target (minutes)</Label>
              <Input type="number" {...register("targetMinutes")} />
              {errors.targetMinutes && <p className="text-xs text-danger mt-1">{errors.targetMinutes.message}</p>}
            </div>
            <Button type="submit" className="w-full">
              Add Subtask
            </Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
