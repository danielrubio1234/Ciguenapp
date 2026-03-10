"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  BellRing,
  ChevronRight,
  Globe,
  ShieldCheck,
  Crown,
  FileDown,
  LogOut,
  Pencil,
  Baby,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePrivy } from "@privy-io/react-auth";

// --- Animation variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// --- Component ---

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = usePrivy();
  const [notificaciones, setNotificaciones] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      router.push("/login");
    } catch {
      toast.error("Error al cerrar sesion. Intenta de nuevo.");
      setIsSigningOut(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-6 px-4 pb-24 pt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* --- Profile Header --- */}
      <motion.section
        variants={itemVariants}
        className="flex flex-col items-center gap-3 text-center"
      >
        <Avatar size="lg" className="size-20">
          <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">
            MC
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold text-secondary">
            Maria Camila
          </h2>
          <p className="text-sm text-muted-foreground">
            Semana 28 de embarazo
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info("Proximamente")}
        >
          <Pencil className="mr-1.5 size-3.5" />
          Editar perfil
        </Button>
      </motion.section>

      {/* --- Baby Info Card --- */}
      <motion.section variants={itemVariants}>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Baby className="size-4 text-primary" />
              Tu bebe
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.info("Proximamente")}
            >
              <Pencil className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Nombre</span>
              <span className="text-sm font-medium text-secondary">Sofia</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Fecha probable de parto
              </span>
              <span className="text-sm font-medium text-secondary">
                15 Jun 2026
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Semana actual
              </span>
              <Badge variant="secondary">Semana 28</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* --- Settings --- */}
      <motion.section variants={itemVariants} className="space-y-1">
        <h3 className="mb-2 px-1 text-sm font-semibold text-secondary">
          Configuracion
        </h3>

        {/* Notificaciones */}
        <SettingsRow
          icon={<BellRing className="size-4 text-primary" />}
          label="Notificaciones"
          onClick={() => setNotificaciones((prev) => !prev)}
          trailing={
            <TogglePill checked={notificaciones} />
          }
        />

        {/* Idioma */}
        <SettingsRow
          icon={<Globe className="size-4 text-primary" />}
          label="Idioma"
          onClick={() => toast.info("Proximamente")}
          trailing={
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Espanol</span>
              <ChevronRight className="size-4" />
            </div>
          }
        />

        {/* Privacidad */}
        <SettingsRow
          icon={<ShieldCheck className="size-4 text-primary" />}
          label="Privacidad de datos"
          onClick={() => toast.info("Proximamente")}
          trailing={<ChevronRight className="size-4 text-muted-foreground" />}
        />

        {/* Plan */}
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
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info("Proximamente");
                }}
              >
                Mejorar a Premium
              </Button>
            </div>
          }
        />

        {/* Historial medico */}
        <SettingsRow
          icon={<FileDown className="size-4 text-primary" />}
          label="Historial medico exportable"
          onClick={() => toast.info("Proximamente")}
          trailing={<ChevronRight className="size-4 text-muted-foreground" />}
        />
      </motion.section>

      {/* --- Sign Out --- */}
      <motion.section variants={itemVariants}>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="mr-2 size-4" />
          {isSigningOut ? "Cerrando sesion..." : "Cerrar sesion"}
        </Button>
      </motion.section>

      {/* --- INVIMA Disclaimer --- */}
      <motion.section variants={itemVariants}>
        <p className="px-2 text-center text-[10px] leading-relaxed text-muted-foreground">
          Ciguena es una herramienta informativa y no reemplaza la consulta
          medica profesional. No es un dispositivo medico. No esta regulado por
          INVIMA. Ante cualquier emergencia, consulta a tu profesional de salud.
        </p>
      </motion.section>
    </motion.div>
  );
}

// --- Settings Row ---

function SettingsRow({
  icon,
  label,
  trailing,
  onClick,
}: {
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

// --- Toggle Pill ---

function TogglePill({ checked }: { checked: boolean }) {
  return (
    <div
      className={`relative h-5 w-9 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <div
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </div>
  );
}
