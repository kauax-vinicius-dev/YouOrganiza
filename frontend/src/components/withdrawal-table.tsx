"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Withdrawal } from "@/lib/types";
import { EmptyState } from "@/components/empty-state";
import { messages } from "@/lib/messages";

interface WithdrawalTableProps {
  withdrawals: Withdrawal[];
  sortField: string;
  sortAsc: boolean;
  onSort: (field: string) => void;
}

export function WithdrawalTable({
  withdrawals,
  sortField,
  sortAsc,
  onSort,
}: WithdrawalTableProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (withdrawals.length === 0) {
    return <EmptyState message={messages.noWithdrawal} />;
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        {withdrawals.map((w) => (
          <div
            key={w._id}
            className="bg-card flex flex-col gap-2 rounded-lg border p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-primary font-semibold">
                {w.technicianName}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatDate(w.date)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{w.withdrawnItem}</Badge>
              <span className="text-sm">Quantidade:</span>
              <Badge className="bg-green-500/10 font-mono text-xs text-green-500">
                {w.quantityTaken}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer select-none"
            onClick={() => onSort("technicianName")}
          >
            Ação {sortField === "technicianName" && "⮃"}
          </TableHead>
          <TableHead
            className="cursor-pointer select-none"
            onClick={() => onSort("withdrawnItem")}
          >
            Item Retirado {sortField === "withdrawnItem" && "⮃"}
          </TableHead>
          <TableHead
            className="cursor-pointer select-none"
            onClick={() => onSort("quantityTaken")}
          >
            Quantidade {sortField === "quantityTaken" && "⮃"}
          </TableHead>
          <TableHead
            className="cursor-pointer select-none"
            onClick={() => onSort("date")}
          >
            Data {sortField === "date" && "⮃"}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {withdrawals.map((w) => (
          <TableRow key={w._id} className="h-14">
            <TableCell className="font-medium">{w.technicianName}</TableCell>
            <TableCell>
              <Badge>{w.withdrawnItem}</Badge>
            </TableCell>
            <TableCell>{w.quantityTaken}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(w.date)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
