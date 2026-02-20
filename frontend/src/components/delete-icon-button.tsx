import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeleteIconButtonProps {
  onClick: () => void;
  className?: string;
}

export function DeleteIconButton({
  onClick,
  className,
}: DeleteIconButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "text-red-500 hover:bg-red-500/10 hover:text-red-500 shrink-0",
        className,
      )}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
