"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageCircle,
  Calendar,
  Flame,
  UserPlus,
  HeartPulse,
  Bell,
  Star,
  Shield,
  Quote,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CiguenaAvatar from "@/components/avatar/CiguenaAvatar";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const features = [
  {
    icon: MessageCircle,
    title: "Respuestas hoy, no en 10 días",
    description:
      "Triaje inteligente que evalúa los síntomas de tu bebé al instante y te dice si necesitas ir a urgencias o si puedes manejar la situación en casa.",
    color: "text-coral",
    bg: "bg-coral/10",
  },
  {
    icon: Calendar,
    title: "Personalizado para tu semana",
    description:
      "Seguimiento diario adaptado a la semana exacta de tu embarazo o la edad de tu bebé. Información precisa para cada etapa.",
    color: "text-warm-orange",
    bg: "bg-warm-orange/10",
  },
  {
    icon: Flame,
    title: "Streaks de autocuidado",
    description:
      "Gamificación estilo Duolingo para motivarte a mantener hábitos saludables. Gana rachas, desbloquea logros y cuida de ti y de tu bebé.",
    color: "text-success",
    bg: "bg-success/10",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "Regístrate y cuéntanos sobre tu bebé",
    description:
      "Crea tu perfil en segundos. Cuéntanos la fecha de nacimiento o la semana de embarazo para personalizar tu experiencia.",
  },
  {
    icon: HeartPulse,
    title: "Cigüeña te hace check-ins diarios",
    description:
      "Cada día recibes preguntas cortas sobre cómo te sientes, síntomas, alimentación y sueño. Todo en menos de 2 minutos.",
  },
  {
    icon: Bell,
    title: "Recibe reportes y alertas personalizadas",
    description:
      "Obtén resúmenes semanales, alertas cuando algo no se ve bien y reportes que puedes compartir con tu médico.",
  },
];

const testimonials = [
  {
    name: "Carolina M.",
    location: "Bogotá",
    text: "Con mi primer hijo no sabía si cada cosita era normal o no. Cigüeña me dio tranquilidad desde la semana 12. Ahora sé exactamente qué esperar.",
    rating: 5,
  },
  {
    name: "Valentina R.",
    location: "Medellín",
    text: "La función de triaje me salvó una noche que mi bebé tenía fiebre. Me indicó ir a urgencias y el pediatra confirmó que fue la decisión correcta.",
    rating: 5,
  },
  {
    name: "Daniela P.",
    location: "Cali",
    text: "Los streaks me motivaron a tomar mis vitaminas todos los días. Suena simple, pero antes se me olvidaba. Ahora llevo 45 días seguidos.",
    rating: 5,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* ─── Hero ─── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1A1A2E] to-[#2D1B4E] px-4 py-20 text-center text-white">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-coral/10 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-warm-orange/8 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 mb-6"
        >
          <CiguenaAvatar size={160} animate className="mx-auto drop-shadow-xl" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10 mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Tu compañera de confianza durante el embarazo y el primer año
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
        >
          Cigüeña te acompaña cada día con información médica validada,
          personalizada para la semana exacta en que estás.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="relative z-10 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 rounded-full px-8 text-base font-semibold shadow-lg shadow-coral/30"
            )}
          >
            Comenzar gratis
          </Link>
          <a
            href="#como-funciona"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-full border-white/30 px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
            )}
          >
            Ver cómo funciona
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-white/50 sm:text-sm"
        >
          <Shield className="mr-1 size-4" />
          <span>Basado en guías AAP</span>
          <span className="text-white/30">·</span>
          <span>OPS/OMS</span>
          <span className="text-white/30">·</span>
          <span>Minsalud Colombia</span>
        </motion.div>
      </section>

      {/* ─── Features ─── */}
      <section className="bg-warm-bg px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-14 text-center"
          >
            <h2 className="text-2xl font-bold text-navy sm:text-3xl md:text-4xl">
              Todo lo que necesitas, en un solo lugar
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Cigüeña combina inteligencia artificial con guías médicas avaladas
              para darte la mejor experiencia de maternidad.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeInUp}>
                <Card className="h-full border-none shadow-md transition-shadow hover:shadow-lg">
                  <CardContent className="flex flex-col items-start gap-4 p-6">
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl ${f.bg}`}
                    >
                      <f.icon className={`size-6 ${f.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-navy">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section
        id="como-funciona"
        className="scroll-mt-16 bg-white px-4 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-14 text-center"
          >
            <h2 className="text-2xl font-bold text-navy sm:text-3xl md:text-4xl">
              Cómo funciona
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              En tres pasos sencillos, Cigüeña se convierte en tu aliada.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-10 md:grid-cols-3"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeInUp}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-5 flex size-16 items-center justify-center rounded-full bg-coral/10">
                  <step.icon className="size-7 text-coral" />
                  <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-navy">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Social Proof ─── */}
      <section className="bg-warm-bg px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-14 text-center"
          >
            <h2 className="text-2xl font-bold text-navy sm:text-3xl md:text-4xl">
              Lo que dicen las mamás
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeInUp}>
                <Card className="h-full border-none shadow-md">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <Quote className="size-6 text-coral/40" />
                    <p className="text-sm leading-relaxed text-navy/80">
                      {t.text}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div>
                        <p className="text-sm font-semibold text-navy">
                          {t.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.location}
                        </p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, idx) => (
                          <Star
                            key={idx}
                            className="size-4 fill-warm-orange text-warm-orange"
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 text-center sm:gap-12"
          >
            <div>
              <p className="text-3xl font-extrabold text-navy sm:text-4xl">
                50,000+
              </p>
              <p className="mt-1 text-sm text-muted-foreground">mamás</p>
            </div>
            <div className="hidden h-10 w-px bg-border sm:block" />
            <div>
              <p className="text-3xl font-extrabold text-navy sm:text-4xl">
                4.9
                <Star className="mb-1 ml-1 inline size-5 fill-warm-orange text-warm-orange" />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">calificación</p>
            </div>
            <div className="hidden h-10 w-px bg-border sm:block" />
            <div>
              <p className="text-3xl font-extrabold text-navy sm:text-4xl">
                100%
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                contenido validado médicamente
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="bg-gradient-to-r from-[#1A1A2E] to-[#2D1B4E] px-4 py-16 text-center text-white sm:py-20">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            Comienza tu camino con Cigüeña
          </h2>
          <p className="mt-4 text-white/70">
            Miles de mamás ya confían en Cigüeña para cuidar de su salud y la
            de su bebé. Únete hoy, es gratis.
          </p>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 h-12 rounded-full px-10 text-base font-semibold shadow-lg shadow-coral/30"
            )}
          >
            Comenzar gratis
          </Link>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border bg-white px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-xl font-bold text-coral">Cigüeña</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/terminos" className="hover:text-navy transition-colors">
              Términos
            </Link>
            <Link
              href="/privacidad"
              className="hover:text-navy transition-colors"
            >
              Privacidad
            </Link>
            <Link href="/contacto" className="hover:text-navy transition-colors">
              Contacto
            </Link>
          </nav>
        </div>
        <div className="mx-auto mt-6 max-w-6xl border-t border-border pt-6">
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Cigüeña es una herramienta de educación e información. No reemplaza
            la consulta médica profesional.
          </p>
        </div>
      </footer>
    </div>
  );
}
