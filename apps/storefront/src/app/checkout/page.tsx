"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

import { ThemeToggle } from "../components/ThemeToggle";
import { OrderSuccessState } from "./components/OrderSuccessState";
import { CheckoutAuthForm } from "./components/CheckoutAuthForm";
import { CheckoutSummary } from "./components/CheckoutSummary";
import { PaymentForm } from "./components/PaymentForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
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
    const savedCart = localStorage.getItem("@store:cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedToken = localStorage.getItem("@store:token");
    if (savedToken) setToken(savedToken);
  }, []);

  const cartTotal = cart.reduce(
    (acc: number, item: any) => acc + item.product.price * item.quantity,
    0,
  );

  const handleAuthSubmit = async (data: any, isRegistering: boolean) => {
    if (loading) return;

    setLoading(true);
    setAuthError(null);

    try {
      if (isRegistering) {
        await axios.post(`${API_URL}/auth/signup`, {
          name: data.name,
          email: data.email,
          password: data.password,
        });

        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email: data.email,
          password: data.password,
        });

        const { token: loginToken, user: loginUser } = loginResponse.data;

        if (loginToken) {
          localStorage.setItem("@store:token", loginToken);
          localStorage.setItem("@store:user", JSON.stringify(loginUser));
          setToken(loginToken);
        } else {
          setAuthError(
            "Conta criada com sucesso! Mude para 'Acesse sua conta' para entrar.",
          );
        }
      } else {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: data.email,
          password: data.password,
        });

        const { token: userToken, user: authUser } = response.data;

        if (userToken) {
          localStorage.setItem("@store:token", userToken);
          localStorage.setItem("@store:user", JSON.stringify(authUser));
          setToken(userToken);
        } else {
          setAuthError("Erro ao autenticar. Verifique suas credenciais.");
        }
      }
    } catch (error: any) {
      console.error("Erro na autenticação:", error);
      setAuthError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeOrder = async (paymentData: any) => {
    if (!token) return;
    setLoading(true);
    try {
      const orderItems = cart.map((item: any) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      await axios.post(
        `${API_URL}/orders`,
        {
          items: orderItems,
          paymentMethod: paymentData.method, // "card" ou "pix"
          paymentDetails:
            paymentData.method === "card"
              ? {
                  cardName: paymentData.cardName,
                }
              : null,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      localStorage.removeItem("@store:cart");
      setCart([]);
      setOrderSuccess(true);
    } catch (error) {
      console.error("Erro ao processar pedido e pagamento", error);
      alert("Houve um erro ao processar o seu pagamento.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return <OrderSuccessState />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col lg:flex-row transition-colors duration-200">
      <div className="flex-1 p-6 md:p-12 lg:p-20 flex flex-col justify-center max-w-2xl mx-auto w-full space-y-8">
        <div className="flex items-center justify-between w-full pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para a loja
          </button>

          <ThemeToggle />
        </div>

        {!token ? (
          <CheckoutAuthForm
            loading={loading}
            authError={authError}
            onAuth={handleAuthSubmit}
            isDark={isDark}
          />
        ) : (
          <PaymentForm
            loading={loading}
            onSubmitPayment={handleFinalizeOrder}
            isDark={isDark}
          />
        )}
      </div>

      <CheckoutSummary cart={cart} cartTotal={cartTotal} />
    </div>
  );
}
