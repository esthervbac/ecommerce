"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { ProductForm } from "../components/ProductForm";
import { ProductTable } from "../components/ProductTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
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

  async function loadData() {
    try {
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

  const handleCreateProduct = async (data: any, resetForm: () => void) => {
    setSubmitLoading(true);
    try {
      const token = localStorage.getItem("@ecommerce:token");
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
      };

      await axios.post(`${API_URL}/products`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      resetForm();
      loadData();
    } catch (error) {
      console.error("Erro ao criar produto", error);
      alert("Houve um erro ao criar o produto.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;

    try {
      const token = localStorage.getItem("@ecommerce:token");
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadData();
    } catch (error) {
      console.error("Erro ao deletar produto", error);
      alert("Não foi possível excluir o produto.");
    }
  };

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
      <Sidebar isDark={isDark} currentPath="/dashboard/products" />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl w-full mx-auto">
        <div>
          <h1
            className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}
          >
            Cadastro de Produtos
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
          >
            Adicione novos itens ao catálogo ou remova produtos existentes.
          </p>
        </div>

        <ProductForm
          categories={categories}
          isDark={isDark}
          submitLoading={submitLoading}
          onSubmit={handleCreateProduct}
        />

        <ProductTable
          products={products}
          isDark={isDark}
          onDelete={handleDeleteProduct}
        />
      </main>
    </div>
  );
}
