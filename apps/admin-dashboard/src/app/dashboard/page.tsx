"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Package, ShoppingBag, Users } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { MetricCard } from "./components/MetricCard";
import { useTheme } from "../../context/ThemeContext";
import { authService } from "../../services/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function DashboardPage() {
  const { isDark } = useTheme();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("Admin");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const { token, user } = authService.getAuthData();
    setAdminName(user?.name || "Admin");

    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setError(null);
      try {
        const response = await axios.get(`${API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!isClient) return null;

  return (
    <div
      className={`min-h-screen flex transition-colors duration-200 ${isDark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"}`}
    >
      <Sidebar isDark={isDark} currentPath="/dashboard" />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl w-full mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">
          Olá, {adminName} 👋
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          </div>
        ) : error ? (
          <p className="text-red-500 font-medium">{error}</p>
        ) : (
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
              title="Total de Clientes"
              value={stats.totalCustomers}
              Icon={Users}
              iconColorClass="text-blue-500"
              isDark={isDark}
            />
          </div>
        )}
      </main>
    </div>
  );
}
