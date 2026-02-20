import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";

interface FormDialogFooterProps {
  loading: boolean;
  submitLabel?: string;
}

export function FormDialogFooter({
  loading,
  submitLabel = "Salvar",
}: FormDialogFooterProps) {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button
          type="button"
          variant="outline"
          className="hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Cancelar
        </Button>
      </DialogClose>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </DialogFooter>
  );
}
