import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Painel Admin - E-commerce",
  description: "Gerenciamento do catálogo e vendas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
