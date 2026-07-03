"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingBag,
  Package,
  LayoutDashboard,
  LogOut,
  Loader2,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      const token = localStorage.getItem("@ecommerce:token");

      const response = await axios.get(`${API_URL}/orders/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data);
    } catch (error) {
      console.error("Erro ao carregar pedidos", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("@ecommerce:token");
    localStorage.removeItem("@ecommerce:user");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold">
              E
            </div>
            <span className="font-bold text-lg tracking-tight">AdminStore</span>
          </div>
          <nav className="space-y-1">
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl text-sm transition"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </a>
            <a
              href="/dashboard/products"
              className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl text-sm transition"
            >
              <Package className="h-4 w-4" /> Produtos (CRUD)
            </a>
            <a
              href="/dashboard/orders"
              className="flex items-center gap-3 px-3 py-2.5 bg-violet-600/10 text-violet-400 font-medium rounded-xl text-sm transition"
            >
              <ShoppingBag className="h-4 w-4" /> Pedidos
            </a>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition"
        >
          <LogOut className="h-4 w-4" /> Sair do Painel
        </button>
      </aside>

      <main className="flex-1 p-10 space-y-10 overflow-y-auto max-h-screen">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Vendas e Pedidos
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Acompanhe o fluxo de compras da sua loja em tempo real.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 font-mono">
                    ID DO PEDIDO: {order.id}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-zinc-300">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-zinc-500" />
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-zinc-500" />
                      Cliente Logado
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-zinc-500 font-medium">
                      TOTAL VALOR
                    </p>
                    <p className="text-lg font-bold text-violet-400">
                      R$ {(order.total ?? 0).toFixed(2)}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-full uppercase">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Itens do carrinho
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {order.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800/60"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item.product?.imageUrl ||
                            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2"
                          }
                          alt={item.product?.name}
                          className="h-10 w-10 object-cover rounded-lg border border-zinc-800"
                        />
                        <div>
                          <p className="text-sm font-medium text-zinc-200">
                            {item.product?.name || "Produto Removido"}
                          </p>
                          <p className="text-xs text-zinc-500">
                            Qtd: {item.quantity} x R${" "}
                            {(item.price ?? 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-zinc-300">
                        R${" "}
                        {((item.quantity ?? 0) * (item.price ?? 0)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center p-12 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500">
              Nenhum pedido foi realizado ainda nesta loja.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
