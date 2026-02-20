"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export function UserMenu() {
  const { user, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 py-6 px-2 hover:bg-border focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-foreground">
            <User className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-medium text-foreground sm:inline-block">
            {user?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 min-h-30 flex flex-col items-center justify-center"
      >
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium text-center">{user?.name}</p>
          <p className="text-xs text-muted-foreground text-center">
            {user?.position}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border w-full" />
        <Button
          onClick={logout}
          variant="ghost"
          size="icon"
          className="w-full h-10 text-red-400 hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
