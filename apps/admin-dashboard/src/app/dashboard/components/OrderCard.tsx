"use client";

import { Calendar, User, DollarSign, ShoppingBag } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  total?: number;
  status: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  items: OrderItem[];
}

interface OrderCardProps {
  order: Order;
  isDark: boolean;
}

export function OrderCard({ order, isDark }: OrderCardProps) {
  return (
    <div
      className={`border rounded-2xl overflow-hidden shadow-xs transition-colors duration-200 ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      }`}
    >
      {/* Topo do card */}
      <div
        className={`p-4 md:p-6 border-b flex flex-wrap items-center justify-between gap-4 ${
          isDark
            ? "bg-zinc-950/40 border-zinc-800"
            : "bg-zinc-50/50 border-zinc-200"
        }`}
      >
        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs text-zinc-500">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              isDark
                ? "bg-zinc-800 border-zinc-700/50 text-zinc-300"
                : "bg-white border-zinc-200 text-zinc-600"
            }`}
          >
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              isDark
                ? "bg-zinc-800 border-zinc-700/50 text-zinc-300"
                : "bg-white border-zinc-200 text-zinc-600"
            }`}
          >
            <User className="h-3.5 w-3.5 text-zinc-400" />
            <span
              className={`font-medium ${isDark ? "text-zinc-200" : "text-zinc-700"}`}
            >
              {order.user?.name || "Cliente Desconhecido"}
            </span>
            <span className="text-zinc-400">({order.user?.email})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full font-medium uppercase tracking-wider">
            {order.status}
          </span>
          <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
            <DollarSign className="h-4 w-4" />
            <span>{(order.totalAmount ?? order.total ?? 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Itens */}
      <div
        className={`p-4 md:p-6 divide-y bg-transparent ${isDark ? "divide-zinc-800" : "divide-zinc-100"}`}
      >
        {order.items?.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  item.product?.imageUrl ||
                  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2"
                }
                alt={item.product?.name}
                className={`h-12 w-12 object-cover rounded-xl border ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800"
                    : "bg-zinc-100 border-zinc-200"
                }`}
              />
              <div>
                <p
                  className={`text-sm font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
                >
                  {item.product?.name || "Produto Removido"}
                </p>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  Quantidade: {item.quantity} x R${" "}
                  {(item.price ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
            <p
              className={`text-sm font-bold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
            >
              R$ {((item.quantity ?? 0) * (item.price ?? 0)).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
