"use client";

import { useEffect, useState } from "react";
import axiosInstance from "axios";
import { Loader2 } from "lucide-react";
import { StoreHeader } from "./components/StoreHeader";
import { FilterBar } from "./components/FilterBar";
import { ProductCard } from "./components/ProductCard";
import { CartDrawer } from "./components/CartDrawer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function StorefrontPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
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
    async function loadStoreData() {
      try {
        const response = await axiosInstance.get(`${API_URL}/products`);
        setProducts(response.data);

        const savedCart = localStorage.getItem("@store:cart");
        if (savedCart) setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Erro ao carregar dados da vitrine", error);
      }
      {
        setLoading(false);
      }
    }
    loadStoreData();
  }, []);

  const handleAddToCart = (product: any) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(
      (item: any) => item.product.id === product.id,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("@store:cart", JSON.stringify(updatedCart));
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (
    productId: string,
    action: "plus" | "minus",
  ) => {
    const updatedCart = cart
      .map((item: any) => {
        if (item.product.id === productId) {
          const newQuantity =
            action === "plus" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter((item: any) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("@store:cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = cart.filter(
      (item: any) => item.product.id !== productId,
    );
    setCart(updatedCart);
    localStorage.setItem("@store:cart", JSON.stringify(updatedCart));
  };

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    let categoryName = "";
    if (product.category) {
      if (typeof product.category === "string") {
        categoryName = product.category;
      } else if (
        typeof product.category === "object" &&
        product.category.name
      ) {
        categoryName = product.category.name;
      }
    }

    const normalize = (str: string) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const normalizedSelected = normalize(selectedCategory);
    const normalizedCategoryName = normalize(categoryName);
    const normalizedProductName = normalize(product.name);
    const normalizedProductDesc = normalize(product.description);

    const matchesCategory =
      selectedCategory === "Todos" ||
      normalizedCategoryName === normalizedSelected ||
      normalizedProductName.includes(normalizedSelected) ||
      normalizedProductDesc.includes(normalizedSelected);

    return matchesSearch && matchesCategory;
  });

  const cartCount = cart.reduce((acc, item: any) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item: any) => acc + item.product.price * item.quantity,
    0,
  );

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
      className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8 w-full">
        <StoreHeader
          cartCount={cartCount}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          isDark={isDark}
        />

        <main className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isDark={isDark}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div
              className={`text-center py-20 border border-dashed rounded-2xl ${isDark ? "border-zinc-800 text-zinc-500" : "border-zinc-300 text-zinc-400"}`}
            >
              Nenhum produto corresponde aos critérios de busca selecionados.
            </div>
          )}
        </main>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        cartTotal={cartTotal}
        isDark={isDark}
      />
    </div>
  );
}
