"use client";

import { ShoppingBag } from "lucide-react";

interface CheckoutSummaryProps {
  cart: any[];
  cartTotal: number;
}

export function CheckoutSummary({ cart, cartTotal }: CheckoutSummaryProps) {
  return (
    <aside className="w-full lg:w-96 bg-white dark:bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 p-6 md:p-12 flex flex-col justify-between transition-colors duration-200">
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <ShoppingBag className="h-5 w-5 text-violet-500" />
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
            Resumo da Compra
          </h3>
        </div>

        <div className="max-h-[60vh] lg:max-h-[50vh] overflow-y-auto pr-2 space-y-3 no-scrollbar">
          {cart.map((item: any) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/40"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-11 w-11 object-cover rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100"
                />
                <div>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1 max-w-35">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Qtd: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                R$ {(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          {cart.length === 0 && (
            <p className="text-sm text-zinc-400 text-center py-8">
              Nenhum item no carrinho.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-6 bg-transparent space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Frete</span>
          <span className="text-emerald-500 font-semibold uppercase tracking-wider text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            Grátis
          </span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Total Geral
          </span>
          <span className="text-xl font-black text-violet-600 dark:text-violet-400">
            R$ {cartTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </aside>
  );
}
