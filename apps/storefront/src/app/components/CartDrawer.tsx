"use client";

import { X, Plus, Minus, ShoppingBag } from "lucide-react";

interface CartItem {
  product: any;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, action: "plus" | "minus") => void;
  onRemoveItem: (productId: string) => void;
  cartTotal: number;
  isDark: boolean;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  cartTotal,
  isDark,
}: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-fade-in"
      />

      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md border-l flex flex-col justify-between z-50 shadow-2xl animate-in slide-in-from-right duration-200 ${
          isDark
            ? "bg-zinc-900 border-zinc-800 text-zinc-100"
            : "bg-white border-zinc-200 text-zinc-900"
        }`}
      >
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-violet-500" />
            <h2 className="font-bold text-lg">Seu Carrinho</h2>
            <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between pt-4 first:pt-0"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.product.imageUrl ||
                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2"
                  }
                  alt={item.product.name}
                  className="h-14 w-14 object-cover rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
                />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold truncate max-w-40">
                    {item.product.name}
                  </h4>
                  <p className="text-xs font-bold text-violet-600 dark:text-violet-400">
                    R$ {item.product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, "minus")}
                    className="p-1.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-bold px-2.5 min-w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, "plus")}
                    className="p-1.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 rounded-xl transition cursor-pointer"
                  title="Remover item"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-400 dark:text-zinc-500 space-y-2">
              <ShoppingBag className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
              <p className="text-sm font-medium">O seu carrinho está vazio.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">
              Subtotal
            </span>
            <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
              R$ {cartTotal.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => {
              window.location.href = "/checkout";
            }}
            disabled={cart.length === 0}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 text-white disabled:text-zinc-400 dark:disabled:text-zinc-600 font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md shadow-violet-600/10 disabled:shadow-none cursor-pointer"
          >
            Avançar para o Checkout
          </button>
        </div>
      </div>
    </>
  );
}
