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

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        {withdrawals.map((w) => (
          <div
            key={w._id}
            className="rounded-lg border bg-card p-4 shadow-sm flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-primary">
                {w.technicianName}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(w.date)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{w.withdrawnItem}</Badge>
              <span className="text-sm">Quantidade:</span>
              <Badge className="font-mono text-xs bg-green-500/10 text-green-500">
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
