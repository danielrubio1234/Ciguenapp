"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Syringe,
  MessageCircle,
  History,
  Flame,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CiguenaAvatar from "@/components/avatar/CiguenaAvatar";

// ---------------------------------------------------------------------------
// Placeholder / mock data (will be replaced with Supabase queries)
// ---------------------------------------------------------------------------
const MOCK_USER_NAME = "Mamá";
const MOCK_WEEK = 28;
const MOCK_STREAK = 7;
const MOCK_HERO = {
  title: "¿Qué es normal hoy?",
  summary:
    "En la semana 28 tu bebé pesa alrededor de 1 kg y mide unos 37 cm. Es normal sentir más cansancio y notar contracciones de Braxton Hicks ocasionales.",
  extended:
    "Tu bebé ya puede abrir y cerrar los ojos, y su cerebro está desarrollando billones de neuronas. Podrías notar que se mueve más activamente después de comer. Recuerda mantener una buena hidratación y descansar cuando lo necesites. Si notas hinchazón repentina en manos o cara, contacta a tu médico.",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

const quickActions = [
  {
    label: "Registro de síntomas",
    icon: ClipboardList,
    href: "/dashboard/progress",
  },
  {
    label: "Próximas vacunas",
    icon: Syringe,
    href: null, // coming soon
  },
  {
    label: "Hablar con Cigueña",
    icon: MessageCircle,
    href: "/dashboard/chat",
  },
  {
    label: "Mi historial",
    icon: History,
    href: null, // coming soon
  },
] as const;

const moods = [
  { emoji: "😊", label: "Bien" },
  { emoji: "😐", label: "Regular" },
  { emoji: "😟", label: "Preocupada" },
] as const;

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const [expanded, setExpanded] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [submittingMood, setSubmittingMood] = useState(false);

  async function handleMoodSubmit() {
    if (!selectedMood) return;
    setSubmittingMood(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood, note: moodNote }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      toast.success("¡Registro guardado!");
      setSelectedMood(null);
      setMoodNote("");
    } catch {
      toast.error("No se pudo guardar tu registro. Intenta de nuevo.");
    } finally {
      setSubmittingMood(false);
    }
  }

  return (
    <motion.div
      className="relative mx-auto max-w-lg px-4 py-6 md:py-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Greeting */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, {MOCK_USER_NAME}
        </h1>
      </motion.div>

      {/* Week badge + streak */}
      <motion.div
        className="mt-3 flex flex-wrap items-center gap-2"
        variants={itemVariants}
      >
        <Badge variant="secondary" className="text-sm">
          Semana {MOCK_WEEK} de embarazo
        </Badge>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-warm-orange">
          <Flame className="size-4" />
          {MOCK_STREAK} días seguidos
        </span>
      </motion.div>

      {/* Hero card */}
      <motion.div variants={itemVariants} className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{MOCK_HERO.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {MOCK_HERO.summary}
            </p>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  key="extended"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {MOCK_HERO.extended}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((v) => !v)}
              className="gap-1 text-primary"
            >
              {expanded ? "Leer menos" : "Leer más"}
              <ChevronDown
                className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily check-in */}
      <motion.div variants={itemVariants} className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>¿Cómo te sientes hoy?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMood(m.label)}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-xl border-2 py-3 text-sm font-medium transition-colors ${
                    selectedMood === m.label
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {selectedMood && (
                <motion.div
                  key="mood-followup"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <textarea
                    placeholder="¿Quieres contarnos más? (opcional)"
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    rows={3}
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                  />
                  <Button
                    className="mt-2 w-full"
                    size="lg"
                    onClick={handleMoodSubmit}
                    disabled={submittingMood}
                  >
                    {submittingMood ? "Guardando..." : "Guardar registro"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={itemVariants} className="mt-4">
        <h2 className="mb-3 text-base font-semibold text-foreground">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const inner = (
              <Card
                className="cursor-pointer transition-shadow hover:shadow-md"
                key={action.label}
              >
                <CardContent className="flex flex-col items-center gap-2 py-4 text-center">
                  <action.icon className="size-6 text-primary" />
                  <span className="text-xs font-medium leading-tight">
                    {action.label}
                  </span>
                </CardContent>
              </Card>
            );

            if (action.href) {
              return (
                <Link key={action.label} href={action.href}>
                  {inner}
                </Link>
              );
            }

            return (
              <div
                key={action.label}
                onClick={() => toast.info("Próximamente disponible")}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent alerts */}
      <motion.div variants={itemVariants} className="mt-4">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex items-center gap-3 py-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-success/10 text-success">
              ✓
            </span>
            <p className="text-sm font-medium text-success">
              Todo normal para tu semana
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating Cigueña avatar */}
      <motion.div
        className="fixed bottom-24 right-4 z-30 md:bottom-6 md:right-6"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <Link href="/dashboard/chat">
          <CiguenaAvatar size={48} animate className="drop-shadow-lg" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
