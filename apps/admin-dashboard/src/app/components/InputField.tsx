"use client";

import { LucideIcon } from "lucide-react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  name: string;
  Icon: LucideIcon;
  register: UseFormRegister<any>;
  validationRules?: object;
  error?: FieldError | any;
  isDark: boolean;
}

export function InputField({
  label,
  type,
  placeholder,
  name,
  Icon,
  register,
  validationRules = {},
  error,
  isDark,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label
        className={`text-sm font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
        <input
          type={type}
          placeholder={placeholder}
          {...register(name, validationRules)}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:border-violet-500 transition text-sm shadow-xs ${
            isDark
              ? "bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600"
              : "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400"
          }`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{String(error.message)}</p>
      )}
    </div>
  );
}
