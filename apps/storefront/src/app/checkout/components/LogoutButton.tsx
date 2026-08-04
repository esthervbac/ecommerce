"use client";

interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <button
      onClick={onLogout}
      className="text-xs font-semibold text-red-500 hover:text-red-600 dark:hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-xl transition cursor-pointer"
    >
      Alterar conta / Sair
    </button>
  );
}
