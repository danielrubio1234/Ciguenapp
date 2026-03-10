"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePrivy } from "@privy-io/react-auth";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CiguenaAvatar from "@/components/avatar/CiguenaAvatar";

export default function LoginPage() {
  const router = useRouter();
  const { ready, authenticated, user, login } = usePrivy();
  const [checking, setChecking] = useState(false);

  // After auth: check if user has a profile → dashboard or onboarding
  useEffect(() => {
    if (!ready || !authenticated || !user?.id) return;

    setChecking(true);
    fetch("/api/profile", {
      headers: { "x-privy-user-id": user.id },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.profile?.onboarding_completed) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      })
      .catch(() => router.push("/onboarding"))
      .finally(() => setChecking(false));
  }, [ready, authenticated, user?.id, router]);

  // While Privy loads or checking profile, show spinner
  if (!ready || (authenticated && checking)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Already authenticated but redirect hasn't fired yet — show go to dashboard
  if (authenticated && !checking) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-4 flex-col">
        <p className="text-muted-foreground text-sm">Ya tienes sesión iniciada.</p>
        <button
          className="text-primary underline text-sm"
          onClick={() => router.push("/dashboard")}
        >
          Ir al panel →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel - hidden on mobile */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center gap-8 px-12"
        style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 100%)",
        }}
      >
        <CiguenaAvatar size={160} animate />
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-white tracking-tight">Cigüeña</h1>
          <p className="text-lg text-white/70 max-w-sm">
            Tu compañera inteligente en el camino hacia la maternidad
          </p>
        </div>
      </motion.div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] lg:hidden pointer-events-none"
          style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 100%)" }}
        />

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="flex justify-center mb-6 lg:hidden">
            <CiguenaAvatar size={80} animate />
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-secondary">
                Bienvenida de vuelta
              </CardTitle>
              <CardDescription>
                Inicia sesión para continuar tu camino
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 pt-2">
              <Button
                className="w-full h-11 text-base font-semibold"
                onClick={login}
              >
                Iniciar sesión / Registrarse
              </Button>

              <p className="text-center text-xs text-muted-foreground px-4">
                Puedes usar tu correo electrónico, Google, o una wallet.
                Si no tienes cuenta, se creará automáticamente.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
