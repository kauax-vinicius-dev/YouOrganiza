import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  loading: boolean;
  label: string;
  loadingLabel?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SubmitButton({
  loading,
  label,
  loadingLabel,
  fullWidth,
  disabled,
  className,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn(fullWidth && "w-full", className)}
      disabled={loading || disabled}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingLabel || label}
        </>
      ) : (
        label
      )}
    </Button>
  );
}
