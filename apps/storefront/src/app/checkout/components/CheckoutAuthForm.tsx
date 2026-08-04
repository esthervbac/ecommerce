"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { InputField } from "../../components/InputField";

interface CheckoutAuthFormProps {
  loading: boolean;
  authError: string | null;
  onAuth: (data: any, isRegistering: boolean) => void;
  isDark: boolean;
}

export function CheckoutAuthForm({
  loading,
  authError,
  onAuth,
  isDark,
}: CheckoutAuthFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = (data: any) => {
    onAuth(data, isRegistering);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-violet-600 to-indigo-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
          {isRegistering ? "Crie sua conta" : "Acesse sua conta"}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Para finalizar o seu pedido com segurança, precisamos identificar
          você.
        </p>
      </div>

      {authError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {isRegistering && (
          <InputField
            label="Nome Completo"
            type="text"
            placeholder="John Doe"
            name="name"
            Icon={User}
            register={register}
            validationRules={{ required: isRegistering }}
            error={errors.name}
            isDark={isDark}
          />
        )}

        <InputField
          label="E-mail"
          type="email"
          placeholder="exemplo@email.com"
          name="email"
          Icon={Mail}
          register={register}
          validationRules={{ required: true }}
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
          validationRules={{ required: true }}
          error={errors.password}
          isDark={isDark}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md shadow-violet-600/10 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processando...</span>
            </>
          ) : isRegistering ? (
            "Cadastrar e Continuar"
          ) : (
            "Entrar e Continuar"
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 underline transition cursor-pointer"
        >
          {isRegistering
            ? "Já possui uma conta? Faça login"
            : "Não tem conta? Crie uma agora"}
        </button>
      </div>
    </div>
  );
}
