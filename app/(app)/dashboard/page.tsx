"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Syringe,
  MessageCircle,
  History,
  Flame,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CiguenaAvatar from "@/components/avatar/CiguenaAvatar";
import { useProfile } from "@/hooks/useProfile";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

const quickActions = [
  { label: "Registro de síntomas", icon: ClipboardList, href: "/dashboard/progress" },
  { label: "Próximas vacunas", icon: Syringe, href: null },
  { label: "Hablar con Cigüeña", icon: MessageCircle, href: "/dashboard/chat" },
  { label: "Mi historial", icon: History, href: null },
] as const;

const moods = [
  { emoji: "😊", label: "Bien" },
  { emoji: "😐", label: "Regular" },
  { emoji: "😟", label: "Preocupada" },
] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

interface WeeklyContent {
  title: string;
  body: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { profile, stats, loading, authHeaders, userId } = useProfile();
  const [expanded, setExpanded] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [submittingMood, setSubmittingMood] = useState(false);
  const [weeklyContent, setWeeklyContent] = useState<WeeklyContent | null>(null);

  // Redirect to onboarding if profile not completed
  useEffect(() => {
    if (!loading && profile && !profile.onboarding_completed) {
      router.push("/onboarding");
    }
  }, [loading, profile, router]);

  // Fetch weekly content based on user's week
  useEffect(() => {
    if (!profile?.pregnancy_week) return;
    const type = profile.status === "pregnant" ? "pregnancy" : "postpartum";
    fetch(`/api/daily-content?week=${profile.pregnancy_week}&type=${type}`)
      .then((r) => r.json())
      .then((data) => setWeeklyContent({ title: data.title, body: data.body }))
      .catch(() => null);
  }, [profile?.pregnancy_week, profile?.status]);

  async function handleMoodSubmit() {
    if (!selectedMood || !userId) return;
    setSubmittingMood(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          mood: selectedMood,
          notes: moodNote,
          weekNumber: profile?.pregnancy_week,
        }),
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const userName = profile?.preferred_name || "Mamá";
  const currentWeek = profile?.pregnancy_week;
  const streak = stats?.streak ?? 0;
  const isPregnant = profile?.status === "pregnant";
  const babyName = profile?.baby_name || profile?.chosen_name;

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
          {getGreeting()}, {userName}
        </h1>
      </motion.div>

      {/* Week badge + streak */}
      <motion.div className="mt-3 flex flex-wrap items-center gap-2" variants={itemVariants}>
        {isPregnant && currentWeek && (
          <Badge variant="secondary" className="text-sm">
            Semana {currentWeek} de embarazo
          </Badge>
        )}
        {!isPregnant && babyName && (
          <Badge variant="secondary" className="text-sm">
            Bebé: {babyName}
          </Badge>
        )}
        {streak > 0 && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-500">
            <Flame className="size-4" />
            {streak} {streak === 1 ? "día seguido" : "días seguidos"}
          </span>
        )}
      </motion.div>

      {/* Hero card */}
      {weeklyContent && (
        <motion.div variants={itemVariants} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{weeklyContent.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {weeklyContent.body.slice(0, 200)}...
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
                      {weeklyContent.body.slice(200)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {weeklyContent.body.length > 200 && (
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
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

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
        <h2 className="mb-3 text-base font-semibold text-foreground">Acciones rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const inner = (
              <Card className="cursor-pointer transition-shadow hover:shadow-md" key={action.label}>
                <CardContent className="flex flex-col items-center gap-2 py-4 text-center">
                  <action.icon className="size-6 text-primary" />
                  <span className="text-xs font-medium leading-tight">{action.label}</span>
                </CardContent>
              </Card>
            );
            if (action.href) {
              return <Link key={action.label} href={action.href}>{inner}</Link>;
            }
            return (
              <div key={action.label} onClick={() => toast.info("Próximamente disponible")}>
                {inner}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Status indicator */}
      <motion.div variants={itemVariants} className="mt-4">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex items-center gap-3 py-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-success/10 text-success">✓</span>
            <p className="text-sm font-medium text-success">
              {isPregnant
                ? `Todo normal para tu semana ${currentWeek ?? ""}`
                : "Todo normal para esta etapa"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating avatar */}
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
