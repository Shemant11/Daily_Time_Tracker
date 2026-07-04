import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { db } from "@/services/db";
import type { Category } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  targetMinutes: z.coerce.number().min(1, "Must be at least 1 minute").max(1440),
  maxMinutes: z.coerce.number().min(0).max(1440).optional(),
});

type FormValues = z.infer<typeof schema>;

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: {
  category: Category | null;
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
    if (category) {
      reset({ name: category.name, targetMinutes: category.targetMinutes, maxMinutes: category.maxMinutes });
    }
  }, [category, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!category) return;
    await db.categories.update(category.id, {
      name: values.name,
      targetMinutes: values.targetMinutes,
      maxMinutes: values.maxMinutes || undefined,
      updatedAt: Date.now(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {category && (
        <DialogContent title={`Edit ${category.name}`}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Target (minutes)</Label>
              <Input type="number" {...register("targetMinutes")} />
              {errors.targetMinutes && <p className="text-xs text-danger mt-1">{errors.targetMinutes.message}</p>}
            </div>
            <div>
              <Label>Max cap (minutes, optional)</Label>
              <Input type="number" {...register("maxMinutes")} />
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
