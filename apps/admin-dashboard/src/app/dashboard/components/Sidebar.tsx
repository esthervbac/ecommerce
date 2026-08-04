"use client";

import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isDark: boolean;
  currentPath: string;
}

export function Sidebar({ isDark, currentPath }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <aside
      className={`w-64 border-r p-6 flex flex-col justify-between transition-colors duration-200 ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      }`}
    >
      <div className="space-y-8">
        <div className="flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white shadow-md">
            E
          </div>
          <span
            className={`font-bold text-lg tracking-tight ${isDark ? "text-white" : "text-zinc-800"}`}
          >
            AdminStore
          </span>
        </div>

        <nav className="space-y-1">
          <a
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
              currentPath === "/dashboard"
                ? "bg-violet-600/10 text-violet-600 dark:text-violet-400 font-medium"
                : isDark
                  ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </a>
          <a
            href="/dashboard/products"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
              currentPath === "/dashboard/products"
                ? "bg-violet-600/10 text-violet-600 dark:text-violet-400 font-medium"
                : isDark
                  ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <Package className="h-4 w-4" />
            Produtos (CRUD)
          </a>
          <a
            href="/dashboard/orders"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
              currentPath === "/dashboard/orders"
                ? "bg-violet-600/10 text-violet-600 dark:text-violet-400 font-medium"
                : isDark
                  ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Pedidos
          </a>
        </nav>
      </div>

      <div
        className={`border-t pt-4 space-y-4 ${isDark ? "border-zinc-800" : "border-zinc-200"}`}
      >
        <div className="px-2">
          <ThemeToggle />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sair do Painel
        </button>
      </div>
    </aside>
  );
}
