"use client";

import React from "react";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, ArrowDownToLine, Monitor, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import type { HardwareItem, Withdrawal } from "@/lib/types";

interface Machine {
  _id: string;
}

const CHART_COLORS = ["#8B5CF6", "#3B82F6", "#34D399", "#FBBF24", "#F472B6"];

export default function DashboardPage() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const [items, setItems] = useState<HardwareItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, withdrawalsRes, machinesRes] = await Promise.all([
          api.get("/hardware-items"),
          api.get("/withdrawals"),
          api.get("/machines"),
        ]);
        setItems(itemsRes.data);
        setWithdrawals(withdrawalsRes.data);
        setMachines(machinesRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const lowStockItems = useMemo(
    () => items.filter((i) => i.amountItem <= 5),
    [items],
  );

  const todayWithdrawals = useMemo(() => {
    const today = new Date().toDateString();
    return withdrawals.filter((w) => new Date(w.date).toDateString() === today);
  }, [withdrawals]);

  const last7DaysData = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      days[key] = 0;
    }
    withdrawals.forEach((w) => {
      const d = new Date(w.date);
      const key = d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      if (key in days) {
        days[key] += Number(w.quantityTaken) || 1;
      }
    });
    return Object.entries(days).map(([day, total]) => ({ day, total }));
  }, [withdrawals]);

  const topItemsData = useMemo(() => {
    const counts: Record<string, number> = {};
    withdrawals.forEach((w) => {
      counts[w.withdrawnItem] =
        (counts[w.withdrawnItem] || 0) + (Number(w.quantityTaken) || 1);
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [withdrawals]);

  const recentWithdrawals = withdrawals.slice(0, 5);

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64 items-center" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral do estoque e atividades recentes"
      />

      {/* Cards de resumo - estilo referencia dark */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 bg-card">
          <CardHeader className="flex flex-col items-center justify-center">
            <CardTitle className="text-xs font-medium text-muted-foreground mb-1">
              Produtos em Estoque
            </CardTitle>
            <div className="flex flex-col items-center">
              <div className="bg-blue-600/20 rounded-full p-3 flex items-center justify-center">
                <Package className="h-9 w-9 text-blue-500" />
              </div>
              <Badge className="mt-2 text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-muted-foreground">
                Estoque
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-full">
            <div className="text-3xl font-extrabold text-foreground mb-0.5">
              {items.length}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              itens cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card">
          <CardHeader className="flex flex-col items-center justify-center">
            <CardTitle className="text-xs font-medium text-muted-foreground mb-1">
              Retiradas Hoje
            </CardTitle>
            <div className="flex flex-col items-center">
              <div className="bg-green-600/20 rounded-full p-3 flex items-center justify-center">
                <ArrowDownToLine className="h-9 w-9 text-green-500" />
              </div>
              <Badge className="mt-2 text-[10px] px-1.5 py-0.5 bg-green-500/20 text-muted-foreground">
                Retiradas
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-3xl font-extrabold text-foreground mb-0.5">
              {todayWithdrawals.length}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {withdrawals.length} total registradas
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card">
          <CardHeader className="flex flex-col items-center justify-center">
            <CardTitle className="text-xs font-medium text-muted-foreground mb-1">
              Máquinas Registradas
            </CardTitle>
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 rounded-full p-3 flex items-center justify-center">
                <Monitor className="h-9 w-9 text-primary" />
              </div>
              <Badge className="mt-2 text-[10px] px-1.5 py-0.5 bg-primary/20 text-muted-foreground">
                Máquinas
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-3xl font-extrabold text-foreground mb-0.5">
              {machines.length}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">no sistema</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card">
          <CardHeader className="flex flex-col items-center justify-center">
            <CardTitle className="text-xs font-medium text-muted-foreground mb-1">
              Estoque Baixo
            </CardTitle>
            <div className="flex flex-col items-center">
              <div className="bg-yellow-600/20 rounded-full p-3 flex items-center justify-center">
                <AlertTriangle
                  className={`h-9 w-9 ${
                    lowStockItems.length > 0
                      ? "text-amber-400"
                      : "text-muted-foreground/60"
                  }`}
                />
              </div>
              <Badge className="mt-2 text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-muted-foreground">
                Baixo
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-3xl font-extrabold text-foreground mb-0.5">
              {lowStockItems.length}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {lowStockItems.length > 0
                ? "Itens precisam de reposição"
                : "Tudo em ordem"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graficos */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="border-0 bg-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Retiradas - Últimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <ResponsiveContainer width="90%" height={300}>
              <BarChart
                data={last7DaysData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: "#64748B", fontWeight: 500 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: "#64748B", fontWeight: 500 }}
                />
                <Tooltip
                  wrapperStyle={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#fff",
                    color: "#222",
                    fontSize: "13px",
                    fontWeight: 500,
                    padding: "8px 12px",
                  }}
                  cursor={{ fill: "rgba(59,130,246,0.08)" }}
                />
                <Bar
                  dataKey="total"
                  fill="#3B82F6"
                  radius={[8, 8, 8, 8]}
                  barSize={40}
                  style={{
                    filter: "drop-shadow(0 2px 8px rgba(59,130,246,0.08))",
                    pointerEvents: "none",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Itens Mais Retirados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topItemsData.length === 0 ? (
              <p className="flex h-70 items-center justify-center text-sm text-muted-foreground">
                Nenhuma retirada registrada.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={topItemsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="value"
                    nameKey="name"
                    label={({ percent }) =>
                      `${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                    style={{ pointerEvents: "none" }}
                  >
                    {topItemsData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#fff",
                      color: "#222",
                      fontSize: "13px",
                      fontWeight: 500,
                      padding: "8px 12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span
                        style={{
                          color: "#64748B",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Atividade Recente */}
        <Card className="border-0 bg-card">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentWithdrawals.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Nenhuma retirada registrada.
              </p>
            ) : isMobile ? (
              <div className="flex flex-col gap-3">
                {recentWithdrawals.map((w) => (
                  <div
                    key={w._id}
                    className="rounded-xl border bg-card p-4 shadow-md flex flex-col gap-2"
                    style={{ background: "var(--card)" }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-primary">
                        {w.technicianName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(w.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Item:</span>
                      <Badge className="font-mono text-xs bg-blue-500/10 text-blue-500">
                        {w.withdrawnItem}
                      </Badge>
                      <span className="text-xs">Quantidade:</span>
                      <Badge className="font-mono text-xs bg-green-500/10 text-green-500">
                        {w.quantityTaken}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent h-14">
                    <TableHead className="text-muted-foreground">
                      Ação
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Item
                    </TableHead>
                    <TableHead className="text-muted-foreground">Qtd</TableHead>
                    <TableHead className="text-muted-foreground">
                      Data
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentWithdrawals.map((w) => (
                    <React.Fragment key={w._id}>
                      <TableRow className="h-14">
                        <TableCell className="font-medium text-foreground">
                          {w.technicianName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{w.withdrawnItem}</Badge>
                        </TableCell>
                        <TableCell className="text-foreground">
                          {w.quantityTaken}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {new Date(w.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Estoque Crítico */}
        <Card className="border-0 bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Estoque Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Todos os itens com estoque adequado.
              </p>
            ) : (
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item._id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {item.itemName}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          item.amountItem === 0
                            ? "text-red-400"
                            : "text-amber-400"
                        }`}
                      >
                        {item.amountItem === 0
                          ? "ESGOTADO"
                          : `${item.amountItem} restante${item.amountItem > 1 ? "s" : ""}`}
                      </span>
                    </div>
                    <Progress
                      value={Math.min((item.amountItem / 20) * 100, 100)}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
