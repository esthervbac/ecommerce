import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moda & Streetwear - Vitrine",
  description: "A melhor loja de roupas e acessórios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className="bg-zinc-950 text-zinc-50 antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
