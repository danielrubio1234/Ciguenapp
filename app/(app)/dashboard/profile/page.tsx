"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  BellRing, ChevronRight, Globe, ShieldCheck,
  Crown, FileDown, LogOut, Pencil, Baby, Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePrivy } from "@privy-io/react-auth";
import { useProfile } from "@/hooks/useProfile";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = usePrivy();
  const { profile, loading, authHeaders, refetch } = useProfile();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      router.push("/login");
    } catch {
      toast.error("Error al cerrar sesión. Intenta de nuevo.");
      setIsSigningOut(false);
    }
  };

  const handleToggleNotification = async (field: string, value: boolean) => {
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ [field]: value }),
      });
      await refetch();
    } catch {
      toast.error("No se pudo actualizar la configuración.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile?.mother_name || profile?.preferred_name || "Usuario";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const babyName = profile?.baby_name || profile?.chosen_name;
  const isPregnant = profile?.status === "pregnant";

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div
      className="flex flex-col gap-6 px-4 pb-24 pt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Header */}
      <motion.section variants={itemVariants} className="flex flex-col items-center gap-3 text-center">
        <Avatar size="lg" className="size-20">
          <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold text-secondary">{displayName}</h2>
          <p className="text-sm text-muted-foreground">
            {isPregnant
              ? profile?.pregnancy_week
                ? `Semana ${profile.pregnancy_week} de embarazo`
                : "Embarazada"
              : babyName
                ? `Mamá de ${babyName}`
                : "Mamá"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.info("Próximamente")}>
          <Pencil className="mr-1.5 size-3.5" />
          Editar perfil
        </Button>
      </motion.section>

      {/* Baby Info Card */}
      {(babyName || profile?.due_date || profile?.birth_date) && (
        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Baby className="size-4 text-primary" />
                {isPregnant ? "Tu bebé" : babyName || "Tu bebé"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {babyName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nombre</span>
                  <span className="text-sm font-medium text-secondary">{babyName}</span>
                </div>
              )}
              {isPregnant && profile?.due_date && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fecha probable de parto</span>
                  <span className="text-sm font-medium text-secondary">
                    {formatDate(profile.due_date)}
                  </span>
                </div>
              )}
              {!isPregnant && profile?.birth_date && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de nacimiento</span>
                  <span className="text-sm font-medium text-secondary">
                    {formatDate(profile.birth_date)}
                  </span>
                </div>
              )}
              {isPregnant && profile?.pregnancy_week && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Semana actual</span>
                  <Badge variant="secondary">Semana {profile.pregnancy_week}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* Settings */}
      <motion.section variants={itemVariants} className="space-y-1">
        <h3 className="mb-2 px-1 text-sm font-semibold text-secondary">Configuración</h3>

        <SettingsRow
          icon={<BellRing className="size-4 text-primary" />}
          label="Notificaciones"
          onClick={() => handleToggleNotification("alerts", !(profile?.alerts ?? true))}
          trailing={<TogglePill checked={profile?.alerts ?? true} />}
        />

        <SettingsRow
          icon={<Globe className="size-4 text-primary" />}
          label="Idioma"
          onClick={() => toast.info("Próximamente")}
          trailing={
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Español</span>
              <ChevronRight className="size-4" />
            </div>
          }
        />

        <SettingsRow
          icon={<ShieldCheck className="size-4 text-primary" />}
          label="Privacidad de datos"
          onClick={() => toast.info("Próximamente")}
          trailing={<ChevronRight className="size-4 text-muted-foreground" />}
        />

        <SettingsRow
          icon={<Crown className="size-4 text-primary" />}
          label="Plan actual"
          onClick={() => {}}
          trailing={
            <div className="flex items-center gap-2">
              <Badge variant="outline">Gratuito</Badge>
              <Button
                size="sm"
                className="h-7 text-xs"
                onClick={(e) => { e.stopPropagation(); toast.info("Próximamente"); }}
              >
                Premium
              </Button>
            </div>
          }
        />

        <SettingsRow
          icon={<FileDown className="size-4 text-primary" />}
          label="Historial médico exportable"
          onClick={() => toast.info("Próximamente")}
          trailing={<ChevronRight className="size-4 text-muted-foreground" />}
        />
      </motion.section>

      {/* Sign Out */}
      <motion.section variants={itemVariants}>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="mr-2 size-4" />
          {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </Button>
      </motion.section>

      {/* Disclaimer */}
      <motion.section variants={itemVariants}>
        <p className="px-2 text-center text-[10px] leading-relaxed text-muted-foreground">
          Cigüeña es una herramienta informativa y no reemplaza la consulta médica profesional.
          Ante cualquier emergencia, consulta a tu profesional de salud.
        </p>
      </motion.section>
    </motion.div>
  );
}

function SettingsRow({ icon, label, trailing, onClick }: {
  icon: React.ReactNode;
  label: string;
  trailing: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {trailing}
    </button>
  );
}

function TogglePill({ checked }: { checked: boolean }) {
  return (
    <div className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
      <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </div>
  );
}
