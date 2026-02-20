"use client";
import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/notification-bell";
import { useAuth } from "@/contexts/auth-context";
import { UserMenu } from "@/components/user-menu";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const segmentNames: Record<string, string> = {
  dashboard: "Painel",
  estoque: "Estoque",
  retiradas: "Retiradas",
  maquinas: "Máquinas",
  trocas: "Trocas",
  assinar: "Assinar",
  gerenciar: "Gerenciar",
};

const hiddenSegments = new Set(["usuarios"]);

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments
    .filter((seg) => !hiddenSegments.has(seg))
    .map((seg, i, arr) => ({
      label: segmentNames[seg] || seg,
      href: "/" + segments.slice(0, segments.indexOf(seg) + 1).join("/"),
      isLast: i === arr.length - 1,
    }));

  // On /dashboard itself, add the title as a second breadcrumb
  if (segments.length === 1 && segments[0] === "dashboard") {
    breadcrumbs[0] = { ...breadcrumbs[0], isLast: false };
    breadcrumbs.push({ label: title, href: pathname, isLast: true });
  }

  return (
    <div className="space-y-3">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
              <BreadcrumbItem>
                {crumb.isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* <MobileMenuSheet /> */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {children}
          {user?.credential === "admin" && <NotificationBell />}
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
