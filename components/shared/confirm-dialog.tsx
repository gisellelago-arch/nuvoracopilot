"use client";

import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  action: (formData: FormData) => void | Promise<void>;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirmar",
  action,
}: ConfirmDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <div className="mt-5 flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm">
              Cancelar
            </Button>
          </DialogClose>
          <form action={action}>
            <DialogClose asChild>
              <Button type="submit" variant="destructive" size="sm">
                {confirmLabel}
              </Button>
            </DialogClose>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
