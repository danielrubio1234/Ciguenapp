"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Inicio", icon: Home, href: "/dashboard" },
  { label: "Cigueña", icon: MessageCircle, href: "/dashboard/chat" },
  { label: "Progreso", icon: BarChart3, href: "/dashboard/progress" },
  { label: "Perfil", icon: User, href: "/dashboard/profile" },
] as const;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 px-6">
          <span className="text-2xl font-bold text-primary">Cigueña</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 pt-4">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="pb-20 md:pb-0 md:pl-64">{children}</main>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card md:hidden">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("size-5", active && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
