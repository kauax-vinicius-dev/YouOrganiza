"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StockFormCard } from "@/components/stock-form-card";
import { RegisterDialogButton } from "@/components/register-dialog-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, PackagePlus, Box } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/contexts/auth-context";
import { CardWithSearch } from "@/components/card-with-search";
import { SearchInput } from "@/components/search-input";
import { FormDialogFooter } from "@/components/form-dialog-footer";
import { DataCard } from "@/components/data-card";
import type { HardwareItem } from "@/lib/types";
import { AccessDenied } from "@/components/access-denied";
import { messages } from "@/lib/messages";

export default function EstoquePage() {
  const { user } = useAuth();
  if (user?.credential !== "admin" && user?.credential !== "admin-root") {
    return (
      <AccessDenied message="Apenas administradores podem acessar o estoque." />
    );
  }
  const isAdmin = user?.credential === "admin";
  const [items, setItems] = useState<HardwareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: "",
    itemName: "",
    amountItem: "",
  });
  const [creating, setCreating] = useState(false);
  const [itemName, setItemName] = useState("");
  const [amountItem, setAmountItem] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [addQuantity, setAddQuantity] = useState("");
  const [addingStock, setAddingStock] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await api.get("/admin/hardware-items");
      setItems(
        Array.isArray(res.data) ? res.data : res.data.hardwareItems || [],
      );
    } catch {
      toast.error(messages.fetchError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/admin/hardware-items", {
        itemName,
        amountItem: Number(amountItem),
      });
      toast.success(messages.createItemSuccess);
      setItemName("");
      setAmountItem("");
      setDialogOpen(false);
      fetchItems();
    } catch {
      toast.error(messages.createItemError);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setEditing(true);
    try {
      await api.patch("/admin/hardware-items", {
        id: editForm._id,
        itemName: editForm.itemName,
        amountItem: editForm.amountItem,
      });
      toast.success(messages.editItemSuccess);
      setEditDialogOpen(false);
      fetchItems();
    } catch {
      toast.error(messages.editItemError);
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/hardware-items/${id}`);
      toast.success(messages.deleteItemSuccess);
      fetchItems();
    } catch {
      toast.error(messages.deleteItemError);
    }
  };

  const handleAddStock = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!selectedItem) {
      toast.error(messages.selectItemError);
      return;
    }
    setAddingStock(true);
    try {
      await api.put(`/hardware-items/${selectedItem}/withdraw`, {
        removedItemsQuantity: -Number(addQuantity),
        technicianName: "Reposição de estoque",
      });
      toast.success(messages.restockSuccess);
      setSelectedItem("");
      setAddQuantity("");
      fetchItems();
    } catch {
      toast.error(messages.restockError);
    } finally {
      setAddingStock(false);
    }
  };

  const filtered = items.filter((i) =>
    i.itemName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Estoque"
        description="Gerencie os itens do estoque de hardware"
      />

      <Tabs defaultValue="produtos">
        <TabsList>
          <TabsTrigger value="produtos" className="cursor-pointer">
            Produtos
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="entrada" className="cursor-pointer">
              Entrada de Estoque
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="produtos" className="space-y-4">
          <CardWithSearch
            title="Produtos Cadastrados"
            searchComponent={
              <SearchInput
                placeholder="Buscar produto..."
                value={search}
                onChange={setSearch}
                className="h-10"
              />
            }
            loading={loading}
            isEmpty={filtered.length === 0}
            emptyMessage={messages.noStock}
            actions={
              isAdmin ? (
                <RegisterDialogButton
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                  icon={Plus}
                  buttonText="Cadastrar Produto"
                  dialogTitle={"Novo Produto"}
                  buttonClassName="cursor-pointer"
                >
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemName">Nome do Item</Label>
                      <Input
                        id="itemName"
                        placeholder="Ex: Cabo de rede Cat6"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Quantidade Inicial</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={amountItem}
                        onChange={(e) => setAmountItem(e.target.value)}
                        required
                      />
                    </div>
                    <FormDialogFooter loading={creating} />
                  </form>
                </RegisterDialogButton>
              ) : undefined
            }
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <DataCard
                  key={item._id}
                  icon={Box}
                  iconColor="#3b82f6"
                  iconBgColor="rgba(59, 130, 246, 0.1)"
                  title={item.itemName}
                  onDelete={isAdmin ? () => handleDelete(item._id) : undefined}
                  EditIconButtonProps={
                    isAdmin
                      ? {
                        onClick: () => {
                          setEditForm({
                            _id: item._id,
                            itemName: item.itemName || "",
                            amountItem: item.amountItem?.toString() || "",
                          });
                          setEditDialogOpen(true);
                        },
                      }
                      : undefined
                  }
                >
                  <p className="text-muted-foreground mt-1 text-sm">
                    Quantidade: {item.amountItem}
                  </p>
                </DataCard>
              ))}
              {editDialogOpen && (
                <RegisterDialogButton
                  open={editDialogOpen}
                  onOpenChange={setEditDialogOpen}
                  icon={Box}
                  buttonText=""
                  dialogTitle={
                    <span className="flex items-center gap-2 text-base">
                      <Box className="h-4 w-4" /> Editar Produto
                    </span>
                  }
                  hideTrigger
                >
                  <form onSubmit={handleEdit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemName">Nome do Item</Label>
                      <Input
                        id="itemName"
                        placeholder="Ex: Cabo de rede Cat6"
                        value={editForm.itemName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, itemName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Quantidade</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={editForm.amountItem}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            amountItem: e.target.value,
                          })
                        }
                      />
                    </div>
                    <FormDialogFooter loading={editing} />
                  </form>
                </RegisterDialogButton>
              )}
            </div>
          </CardWithSearch>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="entrada">
            <StockFormCard
              title={
                <>
                  <PackagePlus className="h-4 w-4" /> Repor Estoque
                </>
              }
              description="Adicione unidades a um item existente"
              selectLabel="Item"
              selectValue={selectedItem}
              onSelectChange={setSelectedItem}
              selectOptions={items.map((item) => ({
                value: item._id,
                label: `${item.itemName} (atual: ${item.amountItem})`,
              }))}
              inputId="addQty"
              inputLabel="Quantidade a Adicionar"
              inputValue={addQuantity}
              onInputChange={(e) => setAddQuantity(e.target.value)}
              submitLabel="Adicionar ao Estoque"
              submitLoading={addingStock}
              onSubmit={handleAddStock}
              inputClassName=""
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
