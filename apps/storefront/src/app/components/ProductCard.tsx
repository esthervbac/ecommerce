"use client";

import { Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isDark: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  isDark,
}: ProductCardProps) {
  return (
    <div
      className={`border rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition duration-200 group ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        <img
          src={
            product.imageUrl ||
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-red-600 rounded-lg">
              Esgotado
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          <h3
            className={`font-bold text-base truncate ${isDark ? "text-zinc-100" : "text-zinc-800"}`}
          >
            {product.name}
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-2 min-h-8">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-zinc-400 block uppercase tracking-wider">
              Preço
            </span>
            <span className="text-lg font-black text-violet-600 dark:text-violet-400">
              R$ {product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="p-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 text-white disabled:text-zinc-400 dark:disabled:text-zinc-600 rounded-xl transition shadow-xs cursor-pointer"
            title="Adicionar ao Carrinho"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
