"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { Lock, Mail, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setApiError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: data.email,
        password: data.password,
      });

      const { token, user } = response.data;

      if (user.role !== "ADMIN") {
        setApiError(
          "Acesso negado. Este painel é exclusivo para administradores.",
        );
        setLoading(false);
        return;
      }

      localStorage.setItem("@ecommerce:token", token);
      localStorage.setItem("@ecommerce:user", JSON.stringify(user));

      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error || "Erro ao conectar com o servidor.";
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Painel Admin</h2>
          <p className="text-sm text-zinc-400">
            Entre com as suas credenciais de administrador
          </p>
        </div>

        {apiError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
              <input
                {...register("email", { required: "O e-mail é obrigatório" })}
                type="email"
                placeholder="exemplo@admin.com"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-violet-500 transition text-sm text-zinc-200 placeholder-zinc-600"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400">
                {String(errors.email.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
              <input
                {...register("password", { required: "A senha é obrigatória" })}
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-violet-500 transition text-sm text-zinc-200 placeholder-zinc-600"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-400">
                {String(errors.password.message)}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Autenticando...
              </>
            ) : (
              "Entrar no Painel"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
