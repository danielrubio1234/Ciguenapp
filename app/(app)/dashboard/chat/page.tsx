"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonal, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CiguenaAvatar from "@/components/avatar/CiguenaAvatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "¡Hola! Soy Cigueña, tu compañera durante esta etapa tan especial. ¿En qué puedo ayudarte hoy?",
};

const SUGGESTED_CHIPS = [
  "¿Qué es normal esta semana?",
  "Tengo una duda sobre alimentación",
  "¿Cuándo debo llamar al médico?",
];

const PREMIUM_BENEFITS = [
  "Mensajes ilimitados",
  "Sin tiempos de espera",
  "Reportes detallados",
  "Soporte prioritario",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <CiguenaAvatar size={32} animate={false} className="shrink-0" />
      <div className="rounded-2xl border bg-white px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-2 w-2 rounded-full bg-muted-foreground/40"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setShowChips(false);
      setInput("");

      const newUserMsg: Message = { role: "user", content: trimmed };
      const updatedMessages = [...messages, newUserMsg];
      setMessages(updatedMessages);

      const newCount = userMessageCount + 1;
      setUserMessageCount(newCount);

      // Show upsell after every 5th user message
      if (newCount > 0 && newCount % 5 === 0) {
        setShowUpsell(true);
      }

      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            messages: updatedMessages,
          }),
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) {
          throw new Error("No readable stream");
        }

        const decoder = new TextDecoder();
        let assistantContent = "";

        // Add empty assistant message that we'll stream into
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantContent,
            };
            return updated;
          });
        }
      } catch (err) {
        toast.error("No se pudo conectar con Cigueña. Intenta de nuevo.", {
          description:
            err instanceof Error ? err.message : "Error desconocido",
        });
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [isLoading, messages, userMessageCount]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleChipClick = (chip: string) => {
    sendMessage(chip);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
      {/* INVIMA Disclaimer */}
      <div className="shrink-0 border-b bg-muted/30 px-4 py-2 text-center text-xs text-muted-foreground">
        Cigueña es una herramienta de educación. No reemplaza la consulta médica
        profesional.
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-end gap-2">
                  <CiguenaAvatar
                    size={32}
                    animate={false}
                    className="shrink-0"
                  />
                  <div className="max-w-[80%] rounded-2xl border bg-white px-4 py-3 text-sm leading-relaxed sm:max-w-md">
                    {msg.content}
                  </div>
                </div>
              )}
              {msg.role === "user" && (
                <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-3 text-sm leading-relaxed text-white sm:max-w-md">
                  {msg.content}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TypingIndicator />
          </motion.div>
        )}

        {/* Upsell banner */}
        <AnimatePresence>
          {showUpsell && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-center sm:flex-row sm:justify-between sm:text-left">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span className="text-sm font-medium">
                    Cigueña Premium: mensajes ilimitados + sin esperas
                  </span>
                </div>
                <Dialog>
                  <DialogTrigger>
                    <Button size="sm" variant="default">
                      Ver planes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cigueña Premium</DialogTitle>
                      <DialogDescription>
                        Accede a todas las funcionalidades de Cigueña sin
                        límites.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-center">
                      <p className="text-3xl font-bold text-primary">
                        $4.99
                        <span className="text-base font-normal text-muted-foreground">
                          /mes
                        </span>
                      </p>
                    </div>
                    <ul className="space-y-3 pb-4">
                      {PREMIUM_BENEFITS.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="size-4 text-primary" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Button disabled className="w-full">
                      Próximamente
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggested chips */}
      {showChips && (
        <div className="shrink-0 border-t bg-background px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="rounded-full border bg-white px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="shrink-0 border-t bg-background px-4 py-3">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-center gap-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            aria-label="Enviar mensaje"
          >
            <SendHorizonal className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
