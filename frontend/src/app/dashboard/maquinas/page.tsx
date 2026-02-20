"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RegisterDialogButton } from "@/components/register-dialog-button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Monitor } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/contexts/auth-context";
import { CardWithSearch } from "@/components/card-with-search";
import { SearchInput } from "@/components/search-input";
import { FormDialogFooter } from "@/components/form-dialog-footer";
import { DataCard } from "@/components/data-card";
import type { Machine } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
import { messages } from "@/lib/messages";

export default function MaquinasPage() {
  const { user } = useAuth();
  if (!user) return null;
  const isAdmin = user?.credential === "admin";
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: "",
    serialNumber: "",
    model: "",
    currentOperation: "",
    observation: "",
  });
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    serialNumber: "",
    model: "",
    currentOperation: "",
    observation: "",
  });

  const fetchMachines = async () => {
    try {
      const res = await api.get("/machines");
      setMachines(res.data);
    } catch {
      toast.error(messages.fetchMachinesError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64 items-center" />;
  }

  const handleCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/machines", form);
      toast.success(messages.createMachineSuccess);
      setForm({
        serialNumber: "",
        model: "",
        currentOperation: "",
        observation: "",
      });
      setDialogOpen(false);
      fetchMachines();
    } catch {
      toast.error(messages.createMachineError);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setEditing(true);
    try {
      await api.patch("/admin/machines", {
        id: editForm._id,
        serialNumber: editForm.serialNumber,
        model: editForm.model,
        currentOperation: editForm.currentOperation,
        observation: editForm.observation,
      });
      toast.success(messages.editMachineSuccess);
      setEditDialogOpen(false);
      fetchMachines();
    } catch {
      toast.error(messages.editMachineError);
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/machines/${id}`);
      toast.success(messages.deleteMachineSuccess);
      fetchMachines();
    } catch {
      toast.error(messages.deleteMachineError);
    }
  };

  const filtered = machines.filter(
    (m) =>
      m.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      m.model.toLowerCase().includes(search.toLowerCase()) ||
      m.currentOperation?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Máquinas"
        description="Gerencie as máquinas cadastradas no sistema"
      />

      <CardWithSearch
        title="Máquinas Registradas"
        description={`${machines.length} máquina${machines.length !== 1 ? "s" : ""} no sistema`}
        searchComponent={
          <SearchInput
            placeholder="Buscar por serial ou modelo..."
            value={search}
            onChange={setSearch}
            className="h-10"
          />
        }
        loading={loading}
        isEmpty={filtered.length === 0}
        emptyMessage={messages.noMachine}
        actions={
          isAdmin && (
            <RegisterDialogButton
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              icon={Plus}
              buttonText="Registrar Máquina"
              dialogTitle={
                <span className="flex items-center gap-2 text-base">
                  <Monitor className="h-4 w-4" />
                  Nova Máquina
                </span>
              }
            >
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serial">Número de Série</Label>
                  <Input
                    id="serial"
                    placeholder="Ex: SN-12345"
                    value={form.serialNumber}
                    onChange={(e) =>
                      setForm({ ...form, serialNumber: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    placeholder="Ex: Dell OptiPlex 7090"
                    value={form.model}
                    onChange={(e) =>
                      setForm({ ...form, model: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operation">Operação Atual</Label>
                  <Input
                    id="operation"
                    placeholder="Ex: Escritório TI"
                    value={form.currentOperation}
                    onChange={(e) =>
                      setForm({ ...form, currentOperation: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="obs">Observação</Label>
                  <Textarea
                    id="obs"
                    placeholder="Observações adicionais sobre a máquina..."
                    value={form.observation}
                    onChange={(e) =>
                      setForm({ ...form, observation: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <FormDialogFooter loading={creating} />
              </form>
            </RegisterDialogButton>
          )
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <DataCard
              key={m._id}
              icon={Monitor}
              iconColor="#8B5CF6"
              iconBgColor="rgba(139, 92, 246, 0.1)"
              title={m.model}
              onDelete={isAdmin ? () => handleDelete(m._id) : undefined}
              deleteLabel="máquina"
              EditIconButtonProps={
                isAdmin
                  ? {
                      onClick: () => {
                        setEditForm({
                          _id: m._id,
                          serialNumber: m.serialNumber || "",
                          model: m.model || "",
                          currentOperation: m.currentOperation || "",
                          observation: m.observation || "",
                        });
                        setEditDialogOpen(true);
                      },
                    }
                  : undefined
              }
            >
              <Badge className="mt-1 bg-blue-500/10 font-mono text-xs text-blue-500">
                {m.serialNumber}
              </Badge>
              <div className="text-muted-foreground mt-3 space-y-1 text-sm">
                <p>Operação: {m.currentOperation || "—"}</p>
                {m.observation && (
                  <p className="truncate">Obs: {m.observation}</p>
                )}
              </div>
            </DataCard>
          ))}
          {editDialogOpen && (
            <RegisterDialogButton
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              icon={Monitor}
              buttonText=""
              dialogTitle={
                <span className="flex items-center gap-2 text-base">
                  <Monitor className="h-4 w-4" /> Editar Máquina
                </span>
              }
              hideTrigger
            >
              <form onSubmit={handleEdit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serial">Número de Série</Label>
                  <Input
                    id="serial"
                    placeholder="Ex: SN-12345"
                    value={editForm.serialNumber}
                    onChange={(e) =>
                      setEditForm({ ...editForm, serialNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    placeholder="Ex: Dell OptiPlex 7090"
                    value={editForm.model}
                    onChange={(e) =>
                      setEditForm({ ...editForm, model: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operation">Operação Atual</Label>
                  <Input
                    id="operation"
                    placeholder="Ex: Escritório TI"
                    value={editForm.currentOperation}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        currentOperation: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="obs">Observação</Label>
                  <Textarea
                    id="obs"
                    placeholder="Observações adicionais sobre a máquina..."
                    value={editForm.observation}
                    onChange={(e) =>
                      setEditForm({ ...editForm, observation: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <FormDialogFooter loading={editing} />
              </form>
            </RegisterDialogButton>
          )}
        </div>
      </CardWithSearch>
    </div>
  );
}
