"use client";

import { ShoppingCart } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface StoreHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function StoreHeader({ cartCount, onOpenCart }: StoreHeaderProps) {
  return (
    <header className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800/60">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-violet-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-violet-600/20">
          E
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">TechStore</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Sua vitrine digital
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={onOpenCart}
          className="relative p-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-700 dark:text-zinc-300 hover:border-violet-500 dark:hover:border-violet-500 transition shadow-xs cursor-pointer"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-violet-600 text-white font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center animate-in zoom-in-50">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
