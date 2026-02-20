import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditIconButtonProps {
  onClick: () => void;
  className?: string;
}

export function EditIconButton({ onClick, className }: EditIconButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "text-blue-500 hover:bg-blue-500/10 hover:text-blue-500 shrink-0",
        className,
      )}
    >
      <Pencil className="h-4 w-4" />
    </Button>
  );
}
