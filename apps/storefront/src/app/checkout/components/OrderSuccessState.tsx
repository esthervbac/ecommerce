"use client";

import { CheckCircle } from "lucide-react";

export function OrderSuccessState() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl max-w-md w-full shadow-xs space-y-6 flex flex-col items-center">
        <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
            Pedido Realizado!
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Sua compra foi processada com sucesso. Acompanhe os detalhes no seu
            painel.
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-xl transition text-sm cursor-pointer shadow-md shadow-violet-600/10"
        >
          Voltar para a Vitrine
        </button>
      </div>
    </div>
  );
}
