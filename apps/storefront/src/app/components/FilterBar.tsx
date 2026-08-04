"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  isDark: boolean;
}

const CATEGORIES = ["Todos", "Moletom", "Calçados", "Mochila", "Camiseta"];

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  isDark,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Buscar produtos no catálogo..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-violet-500 transition shadow-xs ${
            isDark
              ? "bg-zinc-900 border-zinc-800 text-zinc-200 placeholder-zinc-600"
              : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"
          }`}
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 mr-2 shrink-0">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filtros:</span>
        </div>

        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                isActive
                  ? "bg-violet-600 text-white shadow-xs"
                  : isDark
                    ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
