import { cn } from "@/lib/utils";

interface EmptyStateProps {
  search?: string;
  message: string;
  searchMessage?: string;
  className?: string;
}

export function EmptyState({
  search,
  message,
  searchMessage = "Nenhum resultado encontrado.",
  className,
}: EmptyStateProps) {
  return (
    <p
      className={cn(
        "text-muted-foreground py-4 text-center text-sm",
        className,
      )}
    >
      {search ? searchMessage : message}
    </p>
  );
}
