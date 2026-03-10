import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import PrivyProviderWrapper from "@/components/providers/PrivyProviderWrapper";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cigueña — Tu compañera de embarazo y maternidad",
  description:
    "Cigueña te acompaña cada día con información médica validada, personalizada para la semana exacta en que estás.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <PrivyProviderWrapper>
          {children}
          <Toaster position="top-center" richColors />
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
