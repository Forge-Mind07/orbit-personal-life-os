import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, isActive } from "./nav";

export function BottomNav() {
  const reduce = useReducedMotion();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 px-3 lg:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="glass shadow-float mx-auto flex max-w-md items-center justify-between rounded-[26px] border p-1.5">
        {PRIMARY_NAV.map((n) => {
          const active = isActive(n.to, path);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              aria-current={active ? "page" : undefined}
              className={cn("relative flex h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-[20px] text-[11px] font-semibold transition-colors", active ? "text-foreground" : "text-muted-foreground")}
            >
              {active && (
                <motion.span layoutId="bottom-pill" className="absolute inset-0 rounded-[20px] bg-accent" transition={{ duration: reduce ? 0 : 0.28 }} />
              )}
              <Icon className="relative size-[22px]" style={{ color: active ? n.tone : undefined }} strokeWidth={active ? 2.3 : 1.9} />
              <span className="relative">{n.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
