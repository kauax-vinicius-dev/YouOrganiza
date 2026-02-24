"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RegisterDialogButton } from "@/components/register-dialog-button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, ArrowLeftRight, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/contexts/auth-context";
import { CardWithSearch } from "@/components/card-with-search";
import { SearchInput } from "@/components/search-input";
import { FormDialogFooter } from "@/components/form-dialog-footer";
import { TechnicianField } from "@/components/technician-field";
import { formatDate } from "@/lib/utils";
import type { MachineExchange } from "@/lib/types";
import { messages } from "@/lib/messages";

export default function TrocasPage() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const { user } = useAuth();
  if (!user) return null;
  const isAdmin = user?.credential === "admin";
  const [exchanges, setExchanges] = useState<MachineExchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    replacedMachineSerialNumber: "",
    replacedMachinecurrentOperation: "",
    newMachineSerialNumber: "",
    OperationCurrentNewMachine: "",
    observation: "",
    technicianName: "",
  });

  const fetchExchanges = async () => {
    try {
      const res = await api.get("/machine-exchanges");
      setExchanges(res.data);
    } catch {
      toast.error(messages.fetchExchangesError || messages.fetchError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const handleCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/admin/machine-exchanges", {
        ...form,
        technicianName: isAdmin ? form.technicianName : user?.name || "",
      });
      toast.success(messages.createExchangeSuccess);
      setForm({
        replacedMachineSerialNumber: "",
        replacedMachinecurrentOperation: "",
        newMachineSerialNumber: "",
        OperationCurrentNewMachine: "",
        observation: "",
        technicianName: "",
      });
      setDialogOpen(false);
      fetchExchanges();
    } catch {
      toast.error(messages.createExchangeError);
    } finally {
      setCreating(false);
    }
  };

  const [sortField, setSortField] = useState<string>("technicianName");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filtered = exchanges.filter(
    (ex) =>
      ex.technicianName.toLowerCase().includes(search.toLowerCase()) ||
      ex.replacedMachineSerialNumber
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      ex.newMachineSerialNumber.toLowerCase().includes(search.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    const getValue = (obj: MachineExchange, field: string) => {
      const value = obj[field as keyof MachineExchange];
      return typeof value === "string" ? value.toLowerCase() : value;
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
        title="Trocas de Máquinas"
        description="Registre e acompanhe as trocas de máquinas realizadas"
      />

      <CardWithSearch
        title="Histórico de Trocas"
        description={`${exchanges.length} troca${exchanges.length !== 1 ? "s" : ""} registrada${exchanges.length !== 1 ? "s" : ""}`}
        searchComponent={
          <SearchInput
            placeholder="Buscar por colaborador ou serial..."
            value={search}
            onChange={setSearch}
            className="h-10"
          />
        }
        loading={loading}
        isEmpty={filtered.length === 0}
        emptyMessage={messages.noExchange}
        actions={
          <RegisterDialogButton
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            icon={Plus}
            buttonText="Registrar Troca"
            dialogTitle={
              <span className="flex items-center gap-2 text-base">
                <ArrowLeftRight className="h-4 w-4" />
                Nova Troca de Máquina
              </span>
            }
          >
            <form onSubmit={handleCreate} className="space-y-4">
              <TechnicianField
                isAdmin={isAdmin}
                value={form.technicianName}
                onChange={(val) => setForm({ ...form, technicianName: val })}
                userName={user?.name}
                id="techName"
                label="Colaborador"
                placeholder="Nome completo do colaborador"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-destructive/80 text-sm font-medium">
                    Máquina Substituída
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="oldSerial">Nº de Série</Label>
                    <Input
                      id="oldSerial"
                      placeholder="Serial antigo"
                      value={form.replacedMachineSerialNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          replacedMachineSerialNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oldOp">Operação</Label>
                    <Input
                      id="oldOp"
                      placeholder="Descrição da operação"
                      value={form.replacedMachinecurrentOperation}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          replacedMachinecurrentOperation: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-emerald-600">
                    Nova Máquina
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="newSerial">Nº de Série</Label>
                    <Input
                      id="newSerial"
                      placeholder="Serial novo"
                      value={form.newMachineSerialNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          newMachineSerialNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newOp">Operação</Label>
                    <Input
                      id="newOp"
                      placeholder="Descrição da operação"
                      value={form.OperationCurrentNewMachine}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          OperationCurrentNewMachine: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="obsExchange">Observação</Label>
                <Textarea
                  id="obsExchange"
                  placeholder="Motivo da troca, detalhes adicionais..."
                  value={form.observation}
                  onChange={(e) =>
                    setForm({ ...form, observation: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <FormDialogFooter loading={creating} submitLabel="Salvar" />
            </form>
          </RegisterDialogButton>
        }
      >
        {isMobile ? (
          <div className="flex flex-col gap-3">
            {sorted.map((ex) => (
              <div
                key={ex._id}
                className="bg-card flex flex-col gap-2 rounded-lg border p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">
                    {ex.technicianName}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(ex.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">Troca:</span>
                  <Badge className="bg-blue-500/10 font-mono text-xs text-blue-500">
                    {ex.replacedMachineSerialNumber}
                  </Badge>
                  <ArrowRight className="text-muted-foreground h-3 w-3 shrink-0" />
                  <Badge className="bg-green-500/10 font-mono text-xs text-green-500">
                    {ex.newMachineSerialNumber}
                  </Badge>
                </div>
                <div className="text-xs">
                  Operação:{" "}
                  <b>
                    {ex.replacedMachinecurrentOperation ||
                      ex.OperationCurrentNewMachine ||
                      "—"}
                  </b>
                </div>
                <div className="text-muted-foreground text-xs">
                  Obs: {ex.observation || "—"}
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
                      if (sortField === "technicianName")
                        setSortAsc((asc) => !asc);
                      setSortField("technicianName");
                    }}
                  >
                    Colaborador {sortField === "technicianName" && "⮃"}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => {
                      if (sortField === "replacedMachineSerialNumber")
                        setSortAsc((asc) => !asc);
                      setSortField("replacedMachineSerialNumber");
                    }}
                  >
                    Troca {sortField === "replacedMachineSerialNumber" && "⮃"}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => {
                      if (sortField === "replacedMachinecurrentOperation")
                        setSortAsc((asc) => !asc);
                      setSortField("replacedMachinecurrentOperation");
                    }}
                  >
                    Operação{" "}
                    {sortField === "replacedMachinecurrentOperation" && "⮃"}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => {
                      if (sortField === "observation")
                        setSortAsc((asc) => !asc);
                      setSortField("observation");
                    }}
                  >
                    Observação {sortField === "observation" && "⮃"}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => {
                      if (sortField === "date") setSortAsc((asc) => !asc);
                      setSortField("date");
                    }}
                  >
                    Data {sortField === "date" && "⮃"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((ex) => (
                  <TableRow key={ex._id} className="h-14">
                    <TableCell className="font-medium">
                      {ex.technicianName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge className="bg-blue-500/10 font-mono text-xs text-blue-500">
                          {ex.replacedMachineSerialNumber}
                        </Badge>
                        <ArrowRight className="text-muted-foreground h-3 w-3 shrink-0" />
                        <Badge className="bg-green-500/10 font-mono text-xs text-green-500">
                          {ex.newMachineSerialNumber}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {ex.replacedMachinecurrentOperation ||
                        ex.OperationCurrentNewMachine ||
                        "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-50 truncate">
                      {ex.observation || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {formatDate(ex.date)}
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
