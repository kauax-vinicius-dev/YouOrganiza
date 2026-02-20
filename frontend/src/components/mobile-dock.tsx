"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  Monitor,
  ArrowLeftRight,
  User,
  FileSignature,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const mainNav = [{ name: "Painel", href: "/dashboard", icon: LayoutDashboard }];
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

export function MobileDock() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin =
    user?.credential === "admin" || user?.credential === "admin-root";

  const userManagementNav = [managementNav[1]];
  const userEquipmentNav = [...equipmentNav];
  const userDocumentsNav = [...documentsNav];

  let navItems = [
    ...mainNav,
    ...(isAdmin ? managementNav : userManagementNav),
    ...(isAdmin ? equipmentNav : userEquipmentNav),
    ...(isAdmin ? documentsNav : userDocumentsNav),
    ...(isAdmin ? adminNav : []),
  ];

  return (
    <nav className="bg-secondary border-border fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t lg:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-2 py-1 text-xs font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-primary",
            )}
          >
            <item.icon className="h-6 w-6" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
