import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface RegisterDialogButtonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: React.ElementType;
  buttonText: string;
  dialogTitle: ReactNode;
  children: ReactNode;
  buttonClassName?: string;
  hideTrigger?: boolean;
}

export function RegisterDialogButton({
  open,
  onOpenChange,
  icon: Icon,
  buttonText,
  dialogTitle,
  children,
  hideTrigger = false,
}: RegisterDialogButtonProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button>
            <Icon className="mr-1 h-4 w-4" />
            {buttonText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
