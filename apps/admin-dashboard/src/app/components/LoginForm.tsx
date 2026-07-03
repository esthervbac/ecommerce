"use client";

import { useForm } from "react-hook-form";
import { Mail, Lock, Loader2 } from "lucide-react";
import { InputField } from "../components/InputField";

interface LoginFormProps {
  isDark: boolean;
  loading: boolean;
  apiError: string | null;
  onSubmit: (data: any) => void;
}

export function LoginForm({
  isDark,
  loading,
  apiError,
  onSubmit,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {apiError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 p-3.5 rounded-xl text-xs font-medium text-center">
          {apiError}
        </div>
      )}

      <InputField
        label="E-mail corporativo"
        type="email"
        placeholder="nome@empresa.com"
        name="email"
        Icon={Mail}
        register={register}
        validationRules={{ required: "O e-mail é obrigatório" }}
        error={errors.email}
        isDark={isDark}
      />

      <InputField
        label="Senha"
        type="password"
        placeholder="••••••••"
        name="password"
        Icon={Lock}
        register={register}
        validationRules={{ required: "A senha é obrigatória" }}
        error={errors.password}
        isDark={isDark}
      />

      <button
        disabled={loading}
        type="submit"
        className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-violet-600/10 cursor-pointer text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Autenticando...</span>
          </>
        ) : (
          "Acessar Painel"
        )}
      </button>
    </form>
  );
}
