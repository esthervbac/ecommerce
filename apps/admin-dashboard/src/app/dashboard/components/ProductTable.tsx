"use client";

import { Trash2 } from "lucide-react";

interface ProductTableProps {
  products: any[];
  isDark: boolean;
  onDelete: (id: string) => void;
}

export function ProductTable({
  products,
  isDark,
  onDelete,
}: ProductTableProps) {
  return (
    <section
      className={`border rounded-2xl overflow-hidden shadow-xs transition-colors duration-200 ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      }`}
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr
            className={`border-b font-semibold ${isDark ? "bg-zinc-950/40 border-zinc-800 text-zinc-400" : "bg-zinc-50 text-zinc-500"}`}
          >
            <th className="p-4">Produto</th>
            <th className="p-4">Preço</th>
            <th className="p-4">Estoque</th>
            <th className="p-4 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 bg-transparent">
          {products.map((product: any) => (
            <tr
              key={product.id}
              className={`transition ${isDark ? "hover:bg-zinc-950/20" : "hover:bg-zinc-50/50"}`}
            >
              <td className="p-4 flex items-center gap-4">
                <img
                  src={
                    product.imageUrl ||
                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2"
                  }
                  alt={product.name}
                  className="h-10 w-10 object-cover rounded-lg border bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                />
                <div className="truncate max-w-xs">
                  <p
                    className={`font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
                  >
                    {product.name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {product.description}
                  </p>
                </div>
              </td>
              <td
                className={`p-4 font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
              >
                R$ {product.price.toFixed(2)}
              </td>
              <td
                className={`p-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
              >
                {product.stock} un
              </td>
              <td className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="p-12 text-center text-zinc-400 dark:text-zinc-500"
              >
                Nenhum produto cadastrado no catálogo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
