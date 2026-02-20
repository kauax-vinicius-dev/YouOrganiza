"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  Monitor,
  ArrowLeftRight,
  FileSignature,
  Settings,
  LogOut,
  User,
  PanelLeftClose,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { SettingsModal } from "@/components/settings-modal";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

const managementNav = [
  { name: "Estoque", href: "/dashboard/estoque", icon: Package },
  { name: "Retiradas", href: "/dashboard/retiradas", icon: ArrowDownToLine },
];

const equipmentNav = [
  { name: "Máquinas", href: "/dashboard/maquinas", icon: Monitor },
  { name: "Trocas", href: "/dashboard/trocas", icon: ArrowLeftRight },
];

const documentsNav = [
  { name: "Assinar", href: "/dashboard/assinar", icon: FileSignature },
];

const adminNav = [
  { name: "Gerenciar", href: "/dashboard/gerenciar", icon: User },
];

interface NavSectionProps {
  label?: string;
  items: typeof mainNav;
  pathname: string;
  collapsed?: boolean;
}

function NavSection({ label, items, pathname, collapsed }: NavSectionProps) {
  return (
    <div>
      {label && !collapsed && (
        <p className="mb-2 px-3 text-[10px] font-bold uppercase -tracking-tight text-slate-500">
          {label}
        </p>
      )}
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const link = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-primary text-foreground"
                  : "text-muted-foreground hover:bg-slate-200 hover:text-primary dark:hover:bg-border dark:hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.name}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          }

          return link;
        })}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const isAdmin =
    user?.credential === "admin" || user?.credential === "admin-root";
  const { collapsed, toggleCollapsed } = useSidebar();

  // Menus para usuário comum (apenas itens permitidos)
  const userManagementNav = [managementNav[1]]; // Só Retiradas
  const userEquipmentNav = [equipmentNav[0], equipmentNav[1]]; // Máquinas, Trocas
  const userDocumentsNav = [...documentsNav]; // Assinar

  return (
    <aside
      className={cn(
        "hidden shrink-0 bg-secondary lg:flex lg:flex-col transition-all duration-300",
        collapsed ? "w-17" : "w-64",
      )}
    >
      {/* Logo + Toggle */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-border",
          collapsed ? "justify-center px-2" : "justify-between px-6",
        )}
      >
        {collapsed ? (
          <button
            onClick={toggleCollapsed}
            className="cursor-pointer overflow-hidden"
          >
            <Image
              src="/logo.png"
              alt="YOU.BPOTECH"
              width={48}
              height={48}
              className="h-10 w-auto object-contain transition-all duration-300"
            />
          </button>
        ) : (
          <Link href="/dashboard">
            <Image
              src="/logo.png"
              alt="YOU.BPOTECH"
              width={160}
              height={40}
              className="h-10 w-auto transition-all duration-300"
            />
          </Link>
        )}
        {!collapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapsed}
                className="h-8 w-8 text-slate-400 hover:text-foreground hover:bg-white/6"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Recolher
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          "flex flex-1 flex-col gap-4 overflow-y-auto",
          collapsed ? "p-2" : "p-4",
        )}
      >
        <NavSection items={mainNav} pathname={pathname} collapsed={collapsed} />
        <Separator className="bg-border" />
        <NavSection
          label="Gestão"
          items={isAdmin ? managementNav : userManagementNav}
          pathname={pathname}
          collapsed={collapsed}
        />
        <Separator className="bg-border" />
        <NavSection
          label="Equipamentos"
          items={isAdmin ? equipmentNav : userEquipmentNav}
          pathname={pathname}
          collapsed={collapsed}
        />
        <Separator className="bg-border" />
        <NavSection
          label="Documentos"
          items={isAdmin ? documentsNav : userDocumentsNav}
          pathname={pathname}
          collapsed={collapsed}
        />
        {isAdmin && (
          <>
            <Separator className="bg-border" />
            <NavSection
              label="Administração"
              items={adminNav}
              pathname={pathname}
              collapsed={collapsed}
            />
          </>
        )}
      </nav>

      {/* Bottom buttons */}
      <div className="border-t border-border flex flex-col gap-0.5 p-4">
        {collapsed ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <SettingsModal>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-10 text-muted-foreground hover:bg-border hover:text-foreground"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </SettingsModal>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                Configurações
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="w-full h-10 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                Sair
              </TooltipContent>
            </Tooltip>
          </>
        ) : (
          <>
            <SettingsModal>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-5 text-sm font-medium text-muted-foreground hover:bg-border hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Configurações
              </Button>
            </SettingsModal>
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start gap-3 px-3 py-5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </>
        )}
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const isAdmin = user?.credential === "admin";
  const userManagementNav = [managementNav[1]]; // Só Retiradas
  const userEquipmentNav = [equipmentNav[0], equipmentNav[1]]; // Máquinas, Trocas
  const userDocumentsNav = [...documentsNav]; // Assinar

  return (
    <nav className="flex flex-col gap-4 bg-sidebar p-4 h-full">
      <div className="pb-2">
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="YOU.BPOTECH"
            width={160}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>
      <Separator className="bg-border" />
      <NavSection items={mainNav} pathname={pathname} />
      <Separator className="bg-border" />
      <NavSection
        label="Gestão"
        items={isAdmin ? managementNav : userManagementNav}
        pathname={pathname}
      />
      <Separator className="bg-border" />
      <NavSection
        label="Equipamentos"
        items={isAdmin ? equipmentNav : userEquipmentNav}
        pathname={pathname}
      />
      <Separator className="bg-border" />
      <NavSection
        label="Documentos"
        items={isAdmin ? documentsNav : userDocumentsNav}
        pathname={pathname}
      />
      {isAdmin && (
        <>
          <Separator className="bg-white/6" />
          <NavSection
            label="Administração"
            items={adminNav}
            pathname={pathname}
          />
        </>
      )}
      <div className="mt-auto flex flex-col gap-0.5">
        <Separator className="bg-border mb-4" />
        <SettingsModal>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-border hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
        </SettingsModal>
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </nav>
  );
}
