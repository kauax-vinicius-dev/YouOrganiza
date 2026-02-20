import React from "react";

export function AccessDenied({
  message = "Apenas administradores podem acessar esta página.",
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
        <p className="text-lg font-semibold text-red-400">Acesso negado</p>
        <p className="mt-1 text-sm text-red-400/70">{message}</p>
      </div>
    </div>
  );
}
