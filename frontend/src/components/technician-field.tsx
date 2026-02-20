import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/loading-spinner";

interface TechnicianFieldProps {
  isAdmin: boolean;
  value: string;
  onChange: (value: string) => void;
  userName?: string;
  id?: string;
  label?: string;
  placeholder?: string;
}

export function TechnicianField({
  isAdmin,
  value,
  onChange,
  userName,
  id = "technician",
  label = "Colaborador",
  placeholder = "Nome completo do colaborador",
}: TechnicianFieldProps) {
  const [users, setUsers] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      api
        .get("/users")
        .then((res) => {
          const data = res.data;
          if (Array.isArray(data)) setUsers(data);
          else if (Array.isArray(data.users)) setUsers(data.users);
          else setUsers([]);
        })
        .catch(() => setUsers([]))
        .finally(() => setLoading(false));
    }
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        {loading ? (
          <LoadingSpinner size="sm" className="py-2" />
        ) : (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="bg-border/10 cursor-pointer">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {users.map((u) => (
                <SelectItem key={u._id} value={u.name}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <p className="text-foreground bg-border/10 inline-block w-auto max-w-max min-w-0 rounded-md border px-3 py-2 text-sm">
        {userName}
      </p>
    </div>
  );
}
