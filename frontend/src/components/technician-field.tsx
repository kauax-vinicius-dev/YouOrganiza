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
  useEffect(() => {
    if (isAdmin) {
      api
        .get("/users")
        .then((res) => {
          const data = res.data;
          if (Array.isArray(data)) setUsers(data);
          else if (Array.isArray(data.users)) setUsers(data.users);
          else setUsers([]);
        })
        .catch(() => setUsers([]));
    }
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
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
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <p className="text-sm text-foreground bg-border/10 border rounded-md px-3 py-2 inline-block w-auto min-w-0 max-w-max">
        {userName}
      </p>
    </div>
  );
}
