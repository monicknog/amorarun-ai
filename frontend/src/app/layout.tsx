import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amora Run",
  description: "Mentor diario de corrida com ajuste de treino e resiliencia"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}