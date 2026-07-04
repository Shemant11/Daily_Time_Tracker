import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { db } from "@/services/db";
import type { Subtask } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  targetMinutes: z.coerce.number().min(1, "Must be at least 1 minute").max(600),
});

type FormValues = z.infer<typeof schema>;

export function EditSubtaskDialog({
  subtask,
  open,
  onOpenChange,
}: {
  subtask: Subtask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (subtask) reset({ name: subtask.name, targetMinutes: subtask.targetMinutes });
  }, [subtask, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!subtask) return;
    await db.subtasks.update(subtask.id, {
      name: values.name,
      targetMinutes: values.targetMinutes,
      updatedAt: Date.now(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {subtask && (
        <DialogContent title={`Edit ${subtask.name}`}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Subtask Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Target (minutes)</Label>
              <Input type="number" {...register("targetMinutes")} />
              {errors.targetMinutes && <p className="text-xs text-danger mt-1">{errors.targetMinutes.message}</p>}
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
