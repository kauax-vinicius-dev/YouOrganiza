"use client";

import { useEffect, useState } from "react";
import { StockFormCard } from "@/components/stock-form-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, ArrowDownToLine } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/contexts/auth-context";
import { TechnicianField } from "@/components/technician-field";
import { CardWithSearch } from "@/components/card-with-search";
import { WithdrawalTable } from "@/components/withdrawal-table";
import type { HardwareItem, Withdrawal } from "@/lib/types";
import { messages } from "@/lib/messages";

export default function RetiradasPage() {
  const { user } = useAuth();
  const isAdmin = user?.credential === "admin";
  const [items, setItems] = useState<HardwareItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const [itemsRes, withdrawalsRes] = await Promise.all([
        api.get("/hardware-items"),
        api.get("/withdrawals"),
      ]);
      setItems(itemsRes.data);
      setWithdrawals(withdrawalsRes.data);
    } catch {
      toast.error(messages.fetchError);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedItemData = items.find((i) => i._id === selectedItem);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!selectedItem) {
      toast.error(messages.selectItemError);
      return;
    }
    setLoading(true);
    try {
      await api.post("/user/hardware-items-withdrawals", {
        id: selectedItem,
        technicianName: isAdmin ? technicianName : user?.name || "",
        quantityTaken: Number(quantity),
        withdrawnItem: selectedItemData?.itemName || "",
      });
      toast.success(messages.createWithdrawalSuccess);
      setTechnicianName("");
      setQuantity("");
      setSelectedItem("");
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { msg?: string } } };
      toast.error(err.response?.data?.msg || messages.createWithdrawalError);
    } finally {
      setLoading(false);
    }
  };

  const [sortField, setSortField] = useState<string>("technicianName");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filtered = withdrawals.filter(
    (w) =>
      w.technicianName.toLowerCase().includes(search.toLowerCase()) ||
      w.withdrawnItem.toLowerCase().includes(search.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    const getValue = (obj: Withdrawal, field: string) => {
      const value = obj[field as keyof Withdrawal];
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
        title="Retiradas"
        description="Registre e acompanhe as retiradas do estoque"
      />

      <Tabs defaultValue="registrar">
        <TabsList>
          <TabsTrigger className="cursor-pointer" value="registrar">
            Registrar Retirada
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger className="cursor-pointer" value="historico">
              Histórico ({withdrawals.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="registrar">
          {loadingData ? (
            <div className="flex justify-center py-8">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : (
            <StockFormCard
              title={
                <>
                  <ArrowDownToLine className="h-4 w-4" /> Nova Retirada
                </>
              }
              description="Preencha os campos abaixo para registrar a retirada"
              selectLabel="Item para Retirada"
              selectValue={selectedItem}
              onSelectChange={setSelectedItem}
              selectOptions={items.map((item) => ({
                value: item._id,
                label: `${item.itemName} (estoque: ${item.amountItem})`,
              }))}
              inputId="quantity"
              inputLabel="Quantidade"
              inputValue={quantity}
              onInputChange={(e) => setQuantity(e.target.value)}
              inputMin={1}
              inputMax={selectedItemData?.amountItem || 999}
              submitLabel="Registrar Retirada"
              submitLoading={loading}
              onSubmit={handleSubmit}
            >
              {selectedItemData && (
                <p className="text-muted-foreground text-xs">
                  Disponível em estoque: {selectedItemData.amountItem}
                </p>
              )}
              <TechnicianField
                isAdmin={isAdmin}
                value={technicianName}
                onChange={setTechnicianName}
                userName={user?.name}
                id="technician"
                label="Nome do Colaborador"
                placeholder="Nome completo do colaborador"
              />
            </StockFormCard>
          )}
        </TabsContent>

        {isAdmin && (
          <TabsContent value="historico" className="space-y-4">
            <CardWithSearch
              title="Histórico de Retiradas"
              searchPlaceholder="Buscar por colaborador ou item..."
              search={search}
              onSearchChange={setSearch}
              loading={loadingData}
              isEmpty={filtered.length === 0}
              emptyMessage="Nenhuma retirada registrada."
            >
              <WithdrawalTable
                withdrawals={sorted}
                sortField={sortField}
                sortAsc={sortAsc}
                onSort={(field) => {
                  if (sortField === field) setSortAsc((asc) => !asc);
                  setSortField(field);
                }}
              />
            </CardWithSearch>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
