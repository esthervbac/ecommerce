"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreditCard, QrCode, Lock, Loader2 } from "lucide-react";
import { InputField } from "../../components/InputField";

interface PaymentFormProps {
  loading: boolean;
  onSubmitPayment: (paymentData: any) => void;
  isDark: boolean;
}

export function PaymentForm({
  loading,
  onSubmitPayment,
  isDark,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = (data: any) => {
    onSubmitPayment({ method: paymentMethod, ...data });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Forma de Pagamento
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Escolha como deseja pagar e finalize o seu pedido com segurança
          criptografada.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setPaymentMethod("card")}
          className={`p-4 border rounded-xl flex flex-col items-center gap-2 font-medium transition text-sm cursor-pointer ${
            paymentMethod === "card"
              ? "border-violet-600 bg-violet-600/5 text-violet-600 dark:text-violet-400"
              : isDark
                ? "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                : "border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <CreditCard className="h-5 w-5" />
          <span>Cartão de Crédito</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod("pix")}
          className={`p-4 border rounded-xl flex flex-col items-center gap-2 font-medium transition text-sm cursor-pointer ${
            paymentMethod === "pix"
              ? "border-violet-600 bg-violet-600/5 text-violet-600 dark:text-violet-400"
              : isDark
                ? "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                : "border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <QrCode className="h-5 w-5" />
          <span>Pix Instantâneo</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {paymentMethod === "card" ? (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            <InputField
              label="Nome impresso no cartão"
              type="text"
              placeholder="JOÃO O SILVA"
              name="cardName"
              Icon={CreditCard}
              register={register}
              validationRules={{ required: paymentMethod === "card" }}
              error={errors.cardName}
              isDark={isDark}
            />

            <InputField
              label="Número do Cartão"
              type="text"
              placeholder="0000 0000 0000 0000"
              name="cardNumber"
              Icon={CreditCard}
              register={register}
              validationRules={{ required: paymentMethod === "card" }}
              error={errors.cardNumber}
              isDark={isDark}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Validade"
                type="text"
                placeholder="MM/AA"
                name="cardExpiry"
                Icon={CreditCard}
                register={register}
                validationRules={{ required: paymentMethod === "card" }}
                error={errors.cardExpiry}
                isDark={isDark}
              />
              <InputField
                label="CVC / CVV"
                type="text"
                placeholder="123"
                name="cardCvc"
                Icon={Lock}
                register={register}
                validationRules={{ required: paymentMethod === "card" }}
                error={errors.cardCvc}
                isDark={isDark}
              />
            </div>
          </div>
        ) : (
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center space-y-2 animate-in slide-in-from-top-2 duration-200">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Pagamento via Pix
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
              O código QR Code e a chave Copia e Cola serão gerados assim que
              você clicar em finalizar.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-violet-600/10 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processando Pagamento...</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              <span>Finalizar e Pagar Agora</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
