"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileSignature } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function AssinarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assinar Documentos"
        description="Assine e gerencie documentos"
      />

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-primary/10 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            <FileSignature className="text-primary h-7 w-7" />
          </div>
          <h3 className="text-foreground mb-1 text-lg font-medium">Em breve</h3>
          <p className="text-muted-foreground max-w-sm text-sm">
            A funcionalidade de assinatura de documentos esta sendo desenvolvida
            e estará disponivel em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
