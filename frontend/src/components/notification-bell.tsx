"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DeleteIconButton } from "@/components/delete-icon-button";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Package,
  ArrowDownToLine,
  ArrowLeftRight,
  Monitor,
  UserPlus,
  Check,
  CheckCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const typeConfig: Record<
  string,
  { icon: typeof Bell; color: string; bg: string }
> = {
  estoque_baixo: {
    icon: Package,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  retirada: {
    icon: ArrowDownToLine,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  troca_maquina: {
    icon: ArrowLeftRight,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  nova_maquina: {
    icon: Monitor,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  novo_usuario: {
    icon: UserPlus,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Agora";
  if (diffMin < 60) return `${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}d`;
  return date.toLocaleDateString("pt-BR");
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    if (typeof window === "undefined")
      return {
        estoqueBaixo: true,
        retiradas: true,
        trocas: true,
        novasMaquinas: true,
      };
    const saved = localStorage.getItem("notifications");
    return saved
      ? JSON.parse(saved)
      : {
          estoqueBaixo: true,
          retiradas: true,
          trocas: true,
          novasMaquinas: true,
        };
  });

  // Atualiza preferências se mudar no localStorage (ex: outro tab)
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === "notifications") {
        setNotificationPrefs(
          e.newValue
            ? JSON.parse(e.newValue)
            : {
                estoqueBaixo: true,
                retiradas: true,
                trocas: true,
                novasMaquinas: true,
              },
        );
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications");
      // Filtro conforme preferências
      const prefs =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("notifications") || "{}")
          : notificationPrefs;
      const filterMap: Record<
        | "estoque_baixo"
        | "retirada"
        | "troca_maquina"
        | "nova_maquina"
        | "novo_usuario",
        boolean
      > = {
        estoque_baixo: prefs.estoqueBaixo !== false,
        retirada: prefs.retiradas !== false,
        troca_maquina: prefs.trocas !== false,
        nova_maquina: prefs.novasMaquinas !== false,
        novo_usuario: true, // sempre mostra
      };
      const filtered = (res.data.notifications || []).filter(
        (n: Notification) =>
          filterMap[n.type as keyof typeof filterMap] !== false,
      );
      setNotifications(filtered);
      // Contar não lidas filtradas
      setUnreadCount(filtered.filter((n: Notification) => !n.read).length);
    } catch {
      // silently fail
    }
  }, [notificationPrefs]);

  // Poll every 30 seconds
  useEffect(() => {
    const id = setTimeout(fetchNotifications, 0);
    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      clearTimeout(id);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  // Refetch when popover opens
  useEffect(() => {
    if (open) {
      const id = setTimeout(fetchNotifications, 0);
      return () => clearTimeout(id);
    }
  }, [open, fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const deleteNotification = async (id: string, wasUnread: boolean) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const deleteAllNotifications = async () => {
    try {
      await api.delete("/notifications");
      setNotifications([]);
      setUnreadCount(0);
    } catch {}
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 text-foreground hover:text-foreground hover:bg-border"
        >
          <Bell className="size-6" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-110 rounded-xl border border-border bg-card p-0 text-foreground shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              Notificações
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {unreadCount} nova{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-auto gap-1 px-2 py-1 text-xs text-slate-400 hover:text-primary hover:bg-transparent"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Marcar todas lidas
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteAllNotifications}
                className="h-auto gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-500 hover:bg-transparent"
                title="Limpar todas as notificações"
              >
                <X className="h-3.5 w-3.5" />
                Limpar todas
              </Button>
            )}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Notification List */}
        <div className="flex flex-col">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
              <Bell className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const config = typeConfig[notif.type] || {
                icon: Bell,
                color: "text-slate-400",
                bg: "bg-slate-500/10",
              };
              const Icon = config.icon;
              return (
                <div
                  key={notif._id}
                  className={cn(
                    "group flex gap-3 px-4 py-3 items-center transition-colors hover:bg-border border-b border-border last:border-0",
                    !notif.read && "bg-primary/4",
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5",
                      config.bg,
                    )}
                  >
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-medium leading-tight",
                          notif.read ? "text-slate-800black" : "text-slate-200",
                        )}
                      >
                        {notif.title}
                      </p>
                      <span className="shrink-0 text-[10px] text-slate-500">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAsRead(notif._id)}
                        className="h-6 w-6 text-slate-500 hover:bg-border hover:text-primary"
                        title="Marcar como lida"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <DeleteIconButton
                      onClick={() => deleteNotification(notif._id, !notif.read)}
                      className="h-6 w-6 flex items-center justify-center hover:bg-red-500/10"
                    />
                  </div>

                  {/* Unread dot */}
                  {!notif.read && (
                    <div className="flex shrink-0 items-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
