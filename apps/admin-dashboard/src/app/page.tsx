"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ThemeToggle } from "./components/ThemeToggle";
import { LoginForm, LoginFormData } from "./components/LoginForm";
import { authService } from "../services/auth";
import { useTheme } from "../context/ThemeContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { isDark } = useTheme();
  const router = useRouter();

  const handleLoginSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setApiError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);
      const { token, user } = response.data;

      if (user.role !== "ADMIN") {
        setApiError("Acesso negado. Apenas administradores.");
        setLoading(false);
        return;
      }

      authService.setAuthData(token, user);
      router.push("/dashboard");
    } catch (error: any) {
      setApiError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao conectar com o servidor.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-200 ${
        isDark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 font-black text-xl text-white shadow-lg shadow-violet-600/20">
            E
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Painel Administrativo
          </h1>
          <p
            className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
          >
            Entre com suas credenciais de administrador para gerenciar a loja.
          </p>
        </div>

        <div
          className={`border p-6 md:p-8 rounded-2xl transition-colors duration-200 shadow-xl ${
            isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <LoginForm
            isDark={isDark}
            loading={loading}
            apiError={apiError}
            onSubmit={handleLoginSubmit}
          />
        </div>
      </div>
    </div>
  );
}
