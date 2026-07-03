"use client";

import { useForm } from "react-hook-form";
import { Plus, Loader2 } from "lucide-react";

interface ProductFormProps {
  categories: any[];
  isDark: boolean;
  submitLoading: boolean;
  onSubmit: (data: any, resetForm: () => void) => void;
}

export function ProductForm({
  categories,
  isDark,
  submitLoading,
  onSubmit,
}: ProductFormProps) {
  const { register, handleSubmit, reset } = useForm();

  const handleFormSubmit = (data: any) => {
    onSubmit(data, reset);
  };

  return (
    <section
      className={`border p-6 rounded-2xl transition-colors duration-200 shadow-xs ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      }`}
    >
      <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800/60 mb-6">
        <Plus className="h-5 w-5 text-violet-500" />
        <h2 className="font-bold text-lg">Adicionar Novo Produto</h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
            >
              Nome do Produto
            </label>
            <input
              type="text"
              placeholder="Ex: Tênis Air Max"
              {...register("name", { required: true })}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-violet-500 transition shadow-xs ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-700"
                  : "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400"
              }`}
            />
          </div>

          <div className="space-y-1">
            <label
              className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
            >
              Categoria
            </label>
            <select
              {...register("categoryId", { required: true })}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-violet-500 transition shadow-xs appearance-none ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-zinc-200"
                  : "bg-zinc-50 border-zinc-200 text-zinc-800"
              }`}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label
            className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
          >
            Descrição
          </label>
          <textarea
            placeholder="Detalhes sobre o material, tamanho, especificações..."
            {...register("description", { required: true })}
            rows={3}
            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-violet-500 transition shadow-xs ${
              isDark
                ? "bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-700"
                : "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400"
            }`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label
              className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
            >
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price", { required: true })}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-violet-500 transition shadow-xs ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-700"
                  : "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400"
              }`}
            />
          </div>

          <div className="space-y-1">
            <label
              className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
            >
              Estoque Inicial
            </label>
            <input
              type="number"
              placeholder="0"
              {...register("stock", { required: true })}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-violet-500 transition shadow-xs ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-700"
                  : "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400"
              }`}
            />
          </div>

          <div className="space-y-1">
            <label
              className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
            >
              URL da Imagem
            </label>
            <input
              type="text"
              placeholder="https://exemplo.com/foto.jpg"
              {...register("imageUrl", { required: true })}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-violet-500 transition shadow-xs ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-700"
                  : "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400"
              }`}
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitLoading}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-xl transition flex items-center gap-2 text-sm shadow-md cursor-pointer"
          >
            {submitLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Cadastrar Produto"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
