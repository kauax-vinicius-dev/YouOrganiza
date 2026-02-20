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
          className="hover:bg-border gap-2 px-2 py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <div className="bg-primary text-foreground flex h-8 w-8 items-center justify-center rounded-full">
            <User className="h-4 w-4" />
          </div>
          <span className="text-foreground hidden text-sm font-medium sm:inline-block">
            {user?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex min-h-30 w-48 flex-col items-center justify-center"
      >
        <DropdownMenuLabel className="font-normal">
          <p className="text-center text-sm font-medium">{user?.name}</p>
          <p className="text-muted-foreground text-center text-xs">
            {user?.position}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border w-full" />
        <Button
          onClick={logout}
          variant="ghost"
          size="icon"
          className="flex h-10 w-full items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
