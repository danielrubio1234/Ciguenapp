"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Flame, CheckCircle, Bell, Lock, Check, Trophy,
  Baby, Heart, Star, Calendar, Milk, Stethoscope, Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";

const TOTAL_WEEKS = 40;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ProgressPage() {
  const { profile, stats, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentWeek = profile?.pregnancy_week ?? 1;
  const totalCheckins = stats?.total_checkins ?? 0;
  const streak = stats?.streak ?? 0;

  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);
  const visibleStart = Math.max(1, currentWeek - 6);
  const visibleEnd = Math.min(TOTAL_WEEKS, currentWeek + 8);
  const visibleWeeks = weeks.slice(visibleStart - 1, visibleEnd);

  // Badges — unlocked based on real data
  const badges = [
    { label: "Primera semana", icon: Check, earned: currentWeek >= 1 },
    { label: "Un mes completo", icon: Trophy, earned: currentWeek >= 4 },
    { label: "10 check-ins", icon: Heart, earned: totalCheckins >= 10 },
    { label: "Primera consulta", icon: Stethoscope, earned: profile?.has_gynecologist === true },
    { label: "Racha de 7 días", icon: Flame, earned: streak >= 7 },
    { label: "Racha de 30 días", icon: Star, earned: streak >= 30 },
    { label: "6 meses (sem 24)", icon: Calendar, earned: currentWeek >= 24 },
    { label: "Tercer trimestre", icon: Baby, earned: currentWeek >= 28 },
    { label: "Leche materna", icon: Milk, earned: profile?.status === "born" },
  ];

  const statCards = [
    { label: "Días de racha", value: streak, icon: Flame, color: "text-orange-500" },
    { label: "Check-ins totales", value: totalCheckins, icon: CheckCircle, color: "text-success" },
    { label: "Esta semana", value: stats?.checkins_this_week ?? 0, icon: Bell, color: "text-primary" },
  ];

  return (
    <motion.div
      className="flex flex-col gap-6 px-4 pb-24 pt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Weekly Timeline */}
      {profile?.status === "pregnant" && (
        <motion.section variants={itemVariants}>
          <h2 className="mb-1 text-base font-semibold text-secondary">
            Semana {currentWeek} de {TOTAL_WEEKS}
          </h2>
          <Progress value={(currentWeek / TOTAL_WEEKS) * 100} className="mb-3" />
          <div className="overflow-x-auto rounded-xl">
            <div className="flex gap-2 py-2" style={{ minWidth: "max-content" }}>
              {visibleWeeks.map((week) => {
                const isCurrent = week === currentWeek;
                const isCompleted = week < currentWeek;
                const isFuture = week > currentWeek;
                return (
                  <div
                    key={week}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all ${
                      isCurrent
                        ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30"
                        : isCompleted
                          ? "bg-primary/15 text-primary"
                          : "bg-muted/60 text-muted-foreground"
                    } ${isFuture ? "opacity-50" : ""}`}
                  >
                    {isCompleted ? <Check className="size-4" /> : <span>{week}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>
      )}

      {/* Stats */}
      <motion.section variants={itemVariants}>
        <div className="grid grid-cols-3 gap-3">
          {statCards.map((stat) => (
            <Card key={stat.label} size="sm">
              <CardContent className="flex flex-col items-center gap-1 py-1 text-center">
                <stat.icon className={`size-5 ${stat.color}`} />
                <span className="text-xl font-bold text-secondary">{stat.value}</span>
                <span className="text-[10px] leading-tight text-muted-foreground">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Badges */}
      <motion.section variants={itemVariants}>
        <h3 className="mb-3 text-base font-semibold text-secondary">Logros</h3>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <motion.div
              key={badge.label}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors ${
                badge.earned ? "border-primary/20 bg-primary/5" : "border-border bg-muted/30 grayscale"
              }`}
            >
              <div className={`flex size-9 items-center justify-center rounded-full ${
                badge.earned ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {badge.earned ? <badge.icon className="size-4" /> : <Lock className="size-4" />}
              </div>
              <span className={`text-[10px] font-medium leading-tight ${
                badge.earned ? "text-secondary" : "text-muted-foreground"
              }`}>
                {badge.label}
              </span>
              {badge.earned && (
                <Badge variant="default" className="h-4 px-1.5 text-[8px]">Obtenido</Badge>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Weekly report */}
      <motion.section variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Reporte semanal</CardTitle>
            <CardDescription>Resumen de tu actividad esta semana</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Esta semana:{" "}
              <strong>{stats?.checkins_this_week ?? 0} check-ins</strong>
              {profile?.status === "pregnant" && currentWeek && (
                <>, estás en la <strong>semana {currentWeek}</strong> de tu embarazo</>
              )}
              . Racha actual: <strong>{streak} {streak === 1 ? "día" : "días"}</strong>.
            </p>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => toast.info("Próximamente")}
            >
              Ver reporte completo
            </Button>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  );
}
