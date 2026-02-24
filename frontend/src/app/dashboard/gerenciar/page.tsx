"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RegisterDialogButton } from "@/components/register-dialog-button";
import { Plus, UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { CardWithSearch } from "@/components/card-with-search";
import { SearchInput } from "@/components/search-input";
import { FormDialogFooter } from "@/components/form-dialog-footer";
import type { SystemUser } from "@/lib/types";
import { AccessDenied } from "@/components/access-denied";
import { LoadingSpinner } from "@/components/loading-spinner";
import { messages } from "@/lib/messages";

export default function GerenciarUsuarioPage() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const [sortField, setSortField] = useState<string>("name");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const { user } = useAuth();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    position: "",
    credential: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      toast.error(messages.fetchUsersError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.credential === "admin" || user?.credential === "admin-root") {
      fetchUsers();
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64 items-center" />;
  }

  if (user?.credential !== "admin" && user?.credential !== "admin-root") {
    return (
      <AccessDenied message="Apenas administradores podem gerenciar usuários." />
    );
  }

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      position: "",
      credential: "user",
    });
    setShowPassword(false);
  };

  const handleCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.position) {
      toast.error(messages.requiredFields);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error(messages.passwordMismatch);
      return;
    }

    if (form.password.length < 6) {
      toast.error(messages.passwordShort);
      return;
    }

    setCreating(true);
    try {
      await api.post("/admin/users", {
        name: form.name,
        email: form.email,
        password: form.password,
        position: form.position,
        credential: form.credential,
      });
      toast.success(messages.createUserSuccess);
      resetForm();
      setDialogOpen(false);
      fetchUsers();
    } catch (error: unknown) {
      let msg = messages.createUserError;
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { msg?: string } } }).response
          ?.data?.msg === "string"
      ) {
        msg = (error as { response?: { data?: { msg?: string } } }).response!
          .data!.msg!;
      }
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  let filtered = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.position || "").toLowerCase().includes(search.toLowerCase()),
  );

  filtered = filtered.sort((a, b) => {
    const getValue = (obj: SystemUser, field: string) => {
      const value = obj[field as keyof SystemUser];
      return typeof value === "string" ? value.toLowerCase() : "";
    };
    const valA = getValue(a, sortField);
    const valB = getValue(b, sortField);
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciar Usuários"
        description="Visualize e crie usuários do sistema"
      />

      <CardWithSearch
        title="Usuários"
        description={`${users.length} usuário${users.length !== 1 ? "s" : ""} no sistema`}
        searchComponent={
          <SearchInput
            placeholder="Buscar por nome, email ou posição..."
            value={search}
            onChange={setSearch}
            className="h-10"
          />
        }
        loading={loading}
        isEmpty={filtered.length === 0}
        emptyMessage={messages.noUser}
        actions={
          <RegisterDialogButton
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
            icon={Plus}
            buttonText="Novo Usuário"
            dialogTitle={
              <span className="flex items-center gap-2 text-base">
                <UserPlus className="h-4 w-4" />
                Novo Usuário
              </span>
            }
          >
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  placeholder="Ex: João da Silva"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: joao@empresa.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Posição *</Label>
                  <Input
                    id="position"
                    placeholder="Ex: Analista de TI"
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Credencial *</Label>
                  <Select
                    value={form.credential}
                    onValueChange={(value) =>
                      setForm({ ...form, credential: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repita a senha"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>
              <FormDialogFooter loading={creating} submitLabel="Criar" />
            </form>
          </RegisterDialogButton>
        }
      >
        {isMobile ? (
          <div className="flex flex-col gap-3">
            {filtered.map((u) => (
              <div
                key={u._id}
                className="bg-card flex flex-col gap-2 rounded-lg border p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">{u.name}</span>
                  <Badge
                    className={
                      u.credential === "admin"
                        ? "bg-primary/20 text-primary hover:bg-primary/30 font-mono text-xs"
                        : "bg-emerald-500/20 font-mono text-xs text-emerald-400 hover:bg-emerald-500/30"
                    }
                  >
                    {u.credential === "admin" ? "Administrador" : "Usuário"}
                  </Badge>
                </div>
                <div className="text-muted-foreground text-xs">{u.email}</div>
                <div className="text-xs">
                  Posição: <b>{u.position}</b>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => {
                      if (sortField === "name") setSortAsc((asc) => !asc);
                      setSortField("name");
                    }}
                  >
                    Nome {sortField === "name" && "⮃"}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => {
                      if (sortField === "email") setSortAsc((asc) => !asc);
                      setSortField("email");
                    }}
                  >
                    Email {sortField === "email" && "⮃"}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => {
                      if (sortField === "position") setSortAsc((asc) => !asc);
                      setSortField("position");
                    }}
                  >
                    Posição {sortField === "position" && "⮃"}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => {
                      if (sortField === "credential") setSortAsc((asc) => !asc);
                      setSortField("credential");
                    }}
                  >
                    Credencial {sortField === "credential" && "⮃"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u._id} className="h-14">
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell className="text-sm">{u.position}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          u.credential === "admin"
                            ? "bg-primary/20 text-primary hover:bg-primary/30 font-mono text-xs"
                            : "bg-emerald-500/20 font-mono text-xs text-emerald-400 hover:bg-emerald-500/30"
                        }
                      >
                        {u.credential === "admin" ? "Administrador" : "Usuário"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardWithSearch>
    </div>
  );
}
