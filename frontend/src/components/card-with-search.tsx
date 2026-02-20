import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SearchInput } from "@/components/search-input";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EmptyState } from "@/components/empty-state";

interface CardWithSearchProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchComponent?: React.ReactNode;
  loading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function CardWithSearch({
  title,
  description,
  searchPlaceholder,
  search,
  onSearchChange,
  searchComponent,
  loading,
  isEmpty,
  emptyMessage,
  actions,
  children,
}: CardWithSearchProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center w-full sm:w-64">
            {searchComponent ? (
              searchComponent
            ) : (
              <SearchInput
                placeholder={searchPlaceholder}
                value={search ?? ""}
                onChange={onSearchChange ?? (() => {})}
                className="h-10 w-full"
              />
            )}
          </div>
          {actions}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSpinner />
        ) : isEmpty ? (
          <EmptyState search={search ?? ""} message={emptyMessage} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
