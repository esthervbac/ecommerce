"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  LayoutDashboard,
  ShoppingBag,
  LogOut,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  async function loadData() {
    try {
      const token = localStorage.getItem("@ecommerce:token");
      const headers = { Authorization: `Bearer ${token}` };

      const [prodRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/categories`),
      ]);

      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados do catálogo", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (data: any) => {
    setSubmitLoading(true);
    try {
      const token = localStorage.getItem("@ecommerce:token");

      await axios.post(
        `${API_URL}/products`,
        {
          name: data.name,
          description: data.description,
          price: Number(data.price),
          stock: Number(data.stock),
          imageUrl:
            data.imageUrl ||
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
          categoryId: data.categoryId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      reset();
      loadData();
    } catch (error) {
      console.error("Erro ao criar produto", error);
      alert(
        "Erro ao criar produto. Verifique se as permissões de ADMIN estão ativas.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este produto do catálogo?"))
      return;

    try {
      const token = localStorage.getItem("@ecommerce:token");
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadData();
    } catch (error) {
      console.error("Erro ao deletar produto", error);
    }
  };

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
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold">
              E
            </div>
            <span className="font-bold text-lg tracking-tight">AdminStore</span>
          </div>
          <nav className="space-y-1">
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl text-sm transition"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </a>
            <a
              href="/dashboard/products"
              className="flex items-center gap-3 px-3 py-2.5 bg-violet-600/10 text-violet-400 font-medium rounded-xl text-sm transition"
            >
              <Package className="h-4 w-4" /> Produtos (CRUD)
            </a>
            <a
              href="/dashboard/orders"
              className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl text-sm transition"
            >
              <ShoppingBag className="h-4 w-4" /> Pedidos
            </a>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition"
        >
          <LogOut className="h-4 w-4" /> Sair do Painel
        </button>
      </aside>

      <main className="flex-1 p-10 space-y-10 overflow-y-auto max-h-screen">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gerenciar Catálogo
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Adicione, edite ou remova produtos da sua loja.
          </p>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-violet-500" /> Novo Produto
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              {...register("name", { required: true })}
              placeholder="Nome do Produto"
              className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-violet-500 text-sm text-zinc-200"
            />
            <input
              {...register("price", { required: true })}
              type="number"
              step="0.01"
              placeholder="Preço (Ex: 199.90)"
              className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-violet-500 text-sm text-zinc-200"
            />
            <input
              {...register("stock", { required: true })}
              type="number"
              placeholder="Estoque inicial"
              className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-violet-500 text-sm text-zinc-200"
            />

            <input
              {...register("description", { required: true })}
              placeholder="Descrição detalhada"
              className="md:col-span-2 p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-violet-500 text-sm text-zinc-200"
            />

            <select
              {...register("categoryId", { required: true })}
              className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-violet-500 text-sm text-zinc-400"
            >
              <option value="">Selecione a Categoria</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              {...register("imageUrl")}
              placeholder="URL da Imagem (Opcional)"
              className="md:col-span-2 p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-violet-500 text-sm text-zinc-200"
            />

            <button
              type="submit"
              disabled={submitLoading}
              className="bg-violet-600 hover:bg-violet-700 font-medium p-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Cadastrar Produto"
              )}
            </button>
          </form>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-800/40 text-zinc-400 text-xs font-semibold uppercase tracking-wider border-b border-zinc-800">
                <th className="p-4">Produto</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Estoque</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-sm">
              {products.map((product: any) => (
                <tr
                  key={product.id}
                  className="hover:bg-zinc-800/20 transition"
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-10 w-10 object-cover rounded-lg border border-zinc-800"
                    />
                    <div>
                      <p className="font-medium text-zinc-200">
                        {product.name}
                      </p>
                      <p className="text-xs text-zinc-500 truncate max-w-xs">
                        {product.description}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-300 font-medium">
                    R$ {product.price.toFixed(2)}
                  </td>
                  <td className="p-4 text-zinc-400">{product.stock} un</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
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
                  <td colSpan={4} className="p-8 text-center text-zinc-500">
                    Nenhum produto cadastrado no catálogo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
