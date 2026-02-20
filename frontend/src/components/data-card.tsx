import { Card, CardContent } from "@/components/ui/card";
import { DeleteIconButton } from "@/components/delete-icon-button";
import { EditIconButton } from "@/components/edit-icon-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

interface DataCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  title: string;
  children: React.ReactNode;
  onDelete?: () => void;
  deleteLabel?: string;
  EditIconButtonProps?: {
    onClick: () => void;
    className?: string;
  };
}

export function DataCard({
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  children,
  onDelete,
  deleteLabel = "produto",
  EditIconButtonProps,
}: DataCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    if (onDelete) onDelete();
  };

  return (
    <Card className="bg-border/10 border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
              style={{ backgroundColor: iconBgColor }}
            >
              <Icon className="h-5 w-5" style={{ color: iconColor }} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground">{title}</p>
              {children}
            </div>
          </div>
          {onDelete && (
            <div className="flex flex-col items-center justify-center h-full gap-1">
              {EditIconButtonProps && (
                <EditIconButton {...EditIconButtonProps} />
              )}
              <DeleteIconButton onClick={handleDeleteClick} />
            </div>
          )}
        </div>
      </CardContent>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir {deleteLabel}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            Tem certeza que deseja excluir este {deleteLabel}? Essa ação não
            pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
