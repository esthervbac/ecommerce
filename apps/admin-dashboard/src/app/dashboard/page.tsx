"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Package, ShoppingBag, Users } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { MetricCard } from "./components/MetricCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
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
        const response = await axios.get(`${API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
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
      <Sidebar isDark={isDark} currentPath="/dashboard" />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl w-full mx-auto">
        <div>
          <h1
            className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}
          >
            Olá, {adminName} 👋
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
          >
            Aqui está o resumo da sua loja hoje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total de Produtos"
            value={stats.totalProducts}
            Icon={Package}
            iconColorClass="text-violet-500"
            isDark={isDark}
          />

          <MetricCard
            title="Pedidos Realizados"
            value={stats.totalOrders}
            Icon={ShoppingBag}
            iconColorClass="text-emerald-500"
            isDark={isDark}
          />

          <MetricCard
            title="Clientes Ativos"
            value={stats.totalCustomers}
            Icon={Users}
            iconColorClass="text-blue-500"
            isDark={isDark}
          />
        </div>
      </main>
    </div>
  );
}
