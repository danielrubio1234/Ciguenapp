"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Baby, Heart, BellRing, FileText, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import CiguenaAvatar from "@/components/avatar/CiguenaAvatar";

type Status = "pregnant" | "born" | null;
type Gender = "niño" | "niña" | "prefiero_no_decir" | null;

interface FormData {
  // Step 1
  motherName: string;
  status: Status;
  // Step 2A - pregnant
  dueDate: string;
  pregnancyWeek: number | "";
  firstPregnancy: boolean | null;
  chosenName: string;
  // Step 2B - born
  babyName: string;
  birthDate: string;
  gender: Gender;
  firstChild: boolean | null;
  // Step 3
  hasPediatrician: boolean | null;
  hasGynecologist: boolean | null;
  preferredName: string;
  preferredNameType: "mama" | "custom";
  dailyCheckIns: boolean;
  weeklyReports: boolean;
  alerts: boolean;
}

const initialFormData: FormData = {
  motherName: "",
  status: null,
  dueDate: "",
  pregnancyWeek: "",
  firstPregnancy: null,
  chosenName: "",
  babyName: "",
  birthDate: "",
  gender: null,
  firstChild: null,
  hasPediatrician: null,
  hasGynecologist: null,
  preferredName: "Mamá",
  preferredNameType: "mama",
  dailyCheckIns: true,
  weeklyReports: true,
  alerts: true,
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

function calculateWeekFromDueDate(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const conceptionDate = new Date(due);
  conceptionDate.setDate(conceptionDate.getDate() - 280);
  const diffMs = now.getTime() - conceptionDate.getTime();
  const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.max(1, Math.min(42, weeks));
}

function calculateBabyAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffMs = now.getTime() - birth.getTime();
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days < 7) return `${days} día${days !== 1 ? "s" : ""}`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} semana${weeks !== 1 ? "s" : ""}`;
  }
  const months = Math.floor(days / 30);
  return `${months} mes${months !== 1 ? "es" : ""}`;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;
  const progressValue = (step / totalSteps) * 100;

  const updateForm = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const canProceedStep1 = form.motherName.trim() !== "" && form.status !== null;

  const canProceedStep2 = useMemo(() => {
    if (form.status === "pregnant") {
      return form.dueDate !== "" && form.pregnancyWeek !== "" && form.firstPregnancy !== null;
    }
    return form.babyName.trim() !== "" && form.birthDate !== "" && form.firstChild !== null;
  }, [form]);

  const canProceedStep3 =
    form.hasPediatrician !== null &&
    form.hasGynecologist !== null &&
    (form.preferredNameType === "mama" || form.preferredName.trim() !== "");

  const displayName = form.preferredNameType === "mama" ? "Mamá" : form.preferredName;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error("Error al guardar tus datos");
      }
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="motherName">Nombre de la madre</Label>
        <Input
          id="motherName"
          placeholder="Tu nombre"
          value={form.motherName}
          onChange={(e) => updateForm("motherName", e.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-3">
        <Label>¿Estás embarazada o ya nació tu bebé?</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateForm("status", "pregnant")}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
              form.status === "pregnant"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40"
            }`}
          >
            <Heart
              className={`size-8 ${form.status === "pregnant" ? "text-primary" : "text-muted-foreground"}`}
            />
            <span className={`text-sm font-medium ${form.status === "pregnant" ? "text-primary" : ""}`}>
              Embarazada
            </span>
          </button>
          <button
            type="button"
            onClick={() => updateForm("status", "born")}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
              form.status === "born"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40"
            }`}
          >
            <Baby
              className={`size-8 ${form.status === "born" ? "text-primary" : "text-muted-foreground"}`}
            />
            <span className={`text-sm font-medium ${form.status === "born" ? "text-primary" : ""}`}>
              Ya nació
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2Pregnant = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="dueDate">Fecha probable de parto</Label>
        <Input
          id="dueDate"
          type="date"
          value={form.dueDate}
          onChange={(e) => {
            updateForm("dueDate", e.target.value);
            if (e.target.value) {
              updateForm("pregnancyWeek", calculateWeekFromDueDate(e.target.value));
            }
          }}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pregnancyWeek">Semana de embarazo actual</Label>
        <Input
          id="pregnancyWeek"
          type="number"
          min={1}
          max={42}
          placeholder="Ej: 24"
          value={form.pregnancyWeek}
          onChange={(e) =>
            updateForm("pregnancyWeek", e.target.value ? parseInt(e.target.value) : "")
          }
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label>¿Es tu primer embarazo?</Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={form.firstPregnancy === true ? "default" : "outline"}
            className="flex-1"
            onClick={() => updateForm("firstPregnancy", true)}
          >
            Sí
          </Button>
          <Button
            type="button"
            variant={form.firstPregnancy === false ? "default" : "outline"}
            className="flex-1"
            onClick={() => updateForm("firstPregnancy", false)}
          >
            No
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="chosenName">Nombre que has elegido (opcional)</Label>
        <Input
          id="chosenName"
          placeholder="Nombre del bebé"
          value={form.chosenName}
          onChange={(e) => updateForm("chosenName", e.target.value)}
          className="h-10"
        />
      </div>
    </div>
  );

  const renderStep2Born = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="babyName">Nombre del bebé</Label>
        <Input
          id="babyName"
          placeholder="Nombre de tu bebé"
          value={form.babyName}
          onChange={(e) => updateForm("babyName", e.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Fecha de nacimiento</Label>
        <Input
          id="birthDate"
          type="date"
          value={form.birthDate}
          onChange={(e) => updateForm("birthDate", e.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label>Género (opcional)</Label>
        <div className="flex gap-2">
          {([["niño", "Niño"], ["niña", "Niña"], ["prefiero_no_decir", "Prefiero no decir"]] as const).map(
            ([value, label]) => (
              <Button
                key={value}
                type="button"
                variant={form.gender === value ? "default" : "outline"}
                size="sm"
                className="flex-1 text-xs"
                onClick={() => updateForm("gender", form.gender === value ? null : value)}
              >
                {label}
              </Button>
            )
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>¿Es tu primer hijo/a?</Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={form.firstChild === true ? "default" : "outline"}
            className="flex-1"
            onClick={() => updateForm("firstChild", true)}
          >
            Sí
          </Button>
          <Button
            type="button"
            variant={form.firstChild === false ? "default" : "outline"}
            className="flex-1"
            onClick={() => updateForm("firstChild", false)}
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>¿Tienes pediatra asignado?</Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={form.hasPediatrician === true ? "default" : "outline"}
            className="flex-1"
            onClick={() => updateForm("hasPediatrician", true)}
          >
            Sí
          </Button>
          <Button
            type="button"
            variant={form.hasPediatrician === false ? "default" : "outline"}
            className="flex-1"
            onClick={() => updateForm("hasPediatrician", false)}
          >
            No
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>¿Tienes ginecólogo/obstetra?</Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={form.hasGynecologist === true ? "default" : "outline"}
            className="flex-1"
            onClick={() => updateForm("hasGynecologist", true)}
          >
            Sí
          </Button>
          <Button
            type="button"
            variant={form.hasGynecologist === false ? "default" : "outline"}
            className="flex-1"
            onClick={() => updateForm("hasGynecologist", false)}
          >
            No
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>¿Cómo prefieres que te llame Cigüeña?</Label>
        <div className="space-y-2">
          <Button
            type="button"
            variant={form.preferredNameType === "mama" ? "default" : "outline"}
            className="w-full"
            onClick={() => {
              updateForm("preferredNameType", "mama");
              updateForm("preferredName", "Mamá");
            }}
          >
            Mamá
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={form.preferredNameType === "custom" ? "default" : "outline"}
              className="shrink-0"
              onClick={() => updateForm("preferredNameType", "custom")}
            >
              Otro
            </Button>
            {form.preferredNameType === "custom" && (
              <Input
                placeholder="¿Cómo te llamo?"
                value={form.preferredName === "Mamá" ? "" : form.preferredName}
                onChange={(e) => updateForm("preferredName", e.target.value)}
                className="h-8"
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Preferencias de notificación</Label>
        <div className="space-y-2">
          <ToggleSwitch
            icon={<Heart className="size-4 text-primary" />}
            label="Check-ins diarios"
            checked={form.dailyCheckIns}
            onChange={(v) => updateForm("dailyCheckIns", v)}
          />
          <ToggleSwitch
            icon={<FileText className="size-4 text-primary" />}
            label="Reportes semanales"
            checked={form.weeklyReports}
            onChange={(v) => updateForm("weeklyReports", v)}
          />
          <ToggleSwitch
            icon={<BellRing className="size-4 text-primary" />}
            label="Alertas importantes"
            checked={form.alerts}
            onChange={(v) => updateForm("alerts", v)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const personalMessage =
      form.status === "pregnant"
        ? form.pregnancyWeek
          ? `Estás en la semana ${form.pregnancyWeek} de tu embarazo. Voy a estar contigo en cada paso, recordándote tus citas, resolviendo tus dudas y celebrando cada momento.`
          : "Voy a acompañarte durante todo tu embarazo, recordándote tus citas y resolviendo todas tus dudas."
        : form.birthDate
          ? `Tu bebé ${form.babyName} tiene ${calculateBabyAge(form.birthDate)}. Estaré aquí para ayudarte con cada etapa de su crecimiento, desde la alimentación hasta el sueño.`
          : `Estaré aquí para ayudarte con cada etapa del crecimiento de ${form.babyName}.`;

    return (
      <div className="flex flex-col items-center text-center space-y-5">
        <CiguenaAvatar size={150} animate />
        <div className="space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-secondary"
          >
            ¡Hola {displayName}!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            Estoy muy feliz de acompañarte en esta etapa tan especial. Soy Cigüeña, tu asistente
            de maternidad, y voy a estar aquí para ti siempre que me necesites.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            {personalMessage}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="w-full pt-2"
        >
          <Button
            className="w-full h-11 text-base font-semibold"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Ir a mi panel"}
            {!isSubmitting && <ArrowRight className="ml-2 size-4" />}
          </Button>
        </motion.div>
      </div>
    );
  };

  const stepTitles: Record<number, { title: string; description: string }> = {
    1: { title: "Perfil básico", description: "Cuéntanos un poco sobre ti" },
    2: {
      title: form.status === "pregnant" ? "Tu embarazo" : "Tu bebé",
      description:
        form.status === "pregnant"
          ? "Detalles de tu embarazo"
          : "Cuéntanos sobre tu bebé",
    },
    3: { title: "Preferencias", description: "Personaliza tu experiencia" },
    4: { title: "¡Bienvenida!", description: "" },
  };

  const currentStepInfo = stepTitles[step];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Paso {step} de {totalSteps}</span>
            <span>{Math.round(progressValue)}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {/* Card */}
        <Card>
          {step < 4 && (
            <CardHeader>
              <CardTitle>{currentStepInfo.title}</CardTitle>
              {currentStepInfo.description && (
                <CardDescription>{currentStepInfo.description}</CardDescription>
              )}
            </CardHeader>
          )}
          <CardContent>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {step === 1 && renderStep1()}
                {step === 2 && form.status === "pregnant" && renderStep2Pregnant()}
                {step === 2 && form.status === "born" && renderStep2Born()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {step < 4 && (
              <div className="flex gap-3 pt-6">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={goBack} className="flex-1">
                    <ArrowLeft className="mr-1 size-4" />
                    Atrás
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={
                    (step === 1 && !canProceedStep1) ||
                    (step === 2 && !canProceedStep2) ||
                    (step === 3 && !canProceedStep3)
                  }
                  className="flex-1"
                >
                  Siguiente
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Toggle switch component ---------- */

function ToggleSwitch({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
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
    </button>
  );
}
