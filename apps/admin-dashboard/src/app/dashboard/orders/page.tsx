"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { OrderCard } from "../components/OrderCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode =
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark";
      setIsDark(isDarkMode);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function loadOrders() {
      try {
        const token = localStorage.getItem("@ecommerce:token");
        const response = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Erro ao carregar pedidos", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDark ? "bg-zinc-950" : "bg-zinc-50"}`}
      >
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex transition-colors duration-200 ${isDark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"}`}
    >
      <Sidebar isDark={isDark} currentPath="/dashboard/orders" />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl w-full mx-auto">
        <div>
          <h1
            className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}
          >
            Pedidos Recebidos
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
          >
            Gerencie e acompanhe o fluxo de compras dos clientes do seu app.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order: any) => (
            <OrderCard key={order.id} order={order} isDark={isDark} />
          ))}

          {orders.length === 0 && (
            <div
              className={`text-center p-16 border rounded-2xl space-y-2 shadow-xs ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-zinc-500"
                  : "bg-white border-zinc-200 text-zinc-400"
              }`}
            >
              <ShoppingBag
                className={`h-8 w-8 mx-auto ${isDark ? "text-zinc-800" : "text-zinc-300"}`}
              />
              <p className="text-sm">
                Nenhum pedido foi realizado ainda nesta loja.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
