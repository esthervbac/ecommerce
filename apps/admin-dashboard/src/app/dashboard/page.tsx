"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function DashboardPage() {
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("@ecommerce:token");
    const userString = localStorage.getItem("@ecommerce:user");

    if (!token || !userString) {
      window.location.href = "/";
      return;
    }

    const user = JSON.parse(userString);
    setAdminName(user.name);

    async function fetchDashboardData() {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProductsCount(response.data.length);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
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
          {/* Logo */}
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold">
              E
            </div>
            <span className="font-bold text-lg tracking-tight">AdminStore</span>
          </div>

          <nav className="space-y-1">
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 bg-violet-600/10 text-violet-400 font-medium rounded-xl text-sm transition"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </a>
            <a
              href="/dashboard/products"
              className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl text-sm transition"
            >
              <Package className="h-4 w-4" />
              Produtos (CRUD)
            </a>
            <a
              href="/dashboard/orders"
              className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl text-sm transition"
            >
              <ShoppingBag className="h-4 w-4" />
              Pedidos
            </a>
          </nav>
        </div>

        <div className="border-t border-zinc-800 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-semibold text-zinc-300 border border-zinc-700">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-zinc-200 truncate">
                {adminName}
              </p>
              <p className="text-xs text-zinc-500">Administrador</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition"
          >
            <LogOut className="h-4 w-4" />
            Sair do Painel
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {adminName} 👋
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Aqui está o resumo da sua loja hoje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 font-medium">
                Total de Produtos
              </span>
              <Package className="h-5 w-5 text-violet-500" />
            </div>
            <p className="text-3xl font-bold">{productsCount}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 font-medium">
                Pedidos Realizados
              </span>
              <ShoppingBag className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 font-medium">
                Clientes Ativos
              </span>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">1</p>
          </div>
        </div>
      </main>
    </div>
  );
}
