"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Sun,
  Moon,
  Palette,
  Bell,
  Package,
  Monitor,
  ArrowDownToLine,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

export function SettingsModal({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.credential === "admin";
  const sections = [
    { id: "geral", label: "Geral", icon: Settings },
    ...(isAdmin
      ? [{ id: "notificacoes", label: "Notificações", icon: Bell }]
      : []),
  ] as const;

  type SectionId = (typeof sections)[number]["id"];

  function SettingRow({
    icon,
    iconBg,
    title,
    description,
    children,
  }: {
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    title: string;
    description: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border bg-border/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
        </div>
        {children}
      </div>
    );
  }

  function SectionHeader({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) {
    return (
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {icon}
          {title}
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
    );
  }

  const [activeSection, setActiveSection] = useState<SectionId>("geral");
  const { theme, toggleTheme } = useTheme();

  // Notification preferences (persistidas no backend)
  const [notifications, setNotifications] = useState({
    estoqueBaixo: true,
    retiradas: true,
    trocas: true,
    novasMaquinas: true,
  });

  // Busca preferências do backend ao abrir modal (apenas admin)
  useEffect(() => {
    if (!isAdmin) return;
    let ignore = false;
    async function fetchPrefs() {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await api.get("/notifications/prefs", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!ignore && res.data) setNotifications(res.data);
      } catch {}
    }
    fetchPrefs();
    return () => {
      ignore = true;
    };
  }, [isAdmin]);

  // Atualiza backend ao trocar preferência (apenas admin)
  const toggleNotification = (key: keyof typeof notifications) => {
    if (!isAdmin) return;
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      api.put("/notifications/prefs", next, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return next;
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-225 w-[90vw] overflow-hidden border-border bg-card p-0 text-foreground sm:rounded-xl"
        showCloseButton={true}
        aria-describedby="settings-modal-description"
      >
        <div className="flex h-145">
          {/* Sidebar do modal */}
          <div className="flex w-55 shrink-0 flex-col gap-1 border-r border-border p-4">
            <DialogHeader className="pb-2">
              <DialogTitle className="px-2 text-sm font-bold uppercase tracking-widest text-slate-500">
                Configurações
              </DialogTitle>
            </DialogHeader>
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <Button
                  key={section.id}
                  variant="ghost"
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "justify-start gap-2.5 px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-primary text-foreground hover:bg-primary/90"
                      : "text-slate-400 hover:bg-border hover:text-foreground",
                  )}
                >
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </Button>
              );
            })}
          </div>

          {/* Conteúdo */}
          <div className="flex flex-1 flex-col overflow-y-auto p-5">
            {/* ===== GERAL ===== */}
            {activeSection === "geral" && (
              <div className="flex flex-col gap-5">
                <SectionHeader
                  icon={<Palette className="h-4 w-4 text-primary" />}
                  title="Aparência"
                  description="Personalize o visual do sistema."
                />

                <Separator className="bg-border" />

                <SettingRow
                  icon={
                    theme === "dark" ? (
                      <Moon className="h-4 w-4 text-indigo-400" />
                    ) : (
                      <Sun className="h-4 w-4 text-amber-400" />
                    )
                  }
                  iconBg={
                    theme === "dark" ? "bg-indigo-500/10" : "bg-amber-500/10"
                  }
                  iconColor=""
                  title={`Modo ${theme === "dark" ? "Escuro" : "Claro"}`}
                  description={
                    theme === "dark"
                      ? "O tema escuro está ativado."
                      : "O tema claro está ativado."
                  }
                >
                  <Switch
                    checked={theme === "light"}
                    onCheckedChange={toggleTheme}
                  />
                </SettingRow>
              </div>
            )}

            {/* ===== NOTIFICAÇÕES ===== */}
            {isAdmin && activeSection === "notificacoes" && (
              <div className="flex flex-col gap-5">
                <SectionHeader
                  icon={<Bell className="h-4 w-4 text-primary" />}
                  title="Notificações"
                  description="Controle quais alertas você deseja receber."
                />

                <Separator className="bg-border" />

                <SettingRow
                  icon={<Package className="h-4 w-4 text-orange-400" />}
                  iconBg="bg-orange-500/10"
                  iconColor=""
                  title="Estoque baixo"
                  description="Alerta quando itens atingem quantidade mínima."
                >
                  <Switch
                    checked={notifications.estoqueBaixo}
                    onCheckedChange={() => toggleNotification("estoqueBaixo")}
                  />
                </SettingRow>

                <SettingRow
                  icon={<ArrowDownToLine className="h-4 w-4 text-blue-400" />}
                  iconBg="bg-blue-500/10"
                  iconColor=""
                  title="Novas retiradas"
                  description="Notificar quando houver novas retiradas."
                >
                  <Switch
                    checked={notifications.retiradas}
                    onCheckedChange={() => toggleNotification("retiradas")}
                  />
                </SettingRow>

                <SettingRow
                  icon={<ArrowLeftRight className="h-4 w-4 text-emerald-400" />}
                  iconBg="bg-emerald-500/10"
                  iconColor=""
                  title="Trocas de equipamento"
                  description="Notificar quando uma troca for registrada."
                >
                  <Switch
                    checked={notifications.trocas}
                    onCheckedChange={() => toggleNotification("trocas")}
                  />
                </SettingRow>

                <SettingRow
                  icon={<Monitor className="h-4 w-4 text-purple-400" />}
                  iconBg="bg-purple-500/10"
                  iconColor=""
                  title="Novas máquinas"
                  description="Notificar quando uma máquina for cadastrada."
                >
                  <Switch
                    checked={notifications.novasMaquinas}
                    onCheckedChange={() => toggleNotification("novasMaquinas")}
                  />
                </SettingRow>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
