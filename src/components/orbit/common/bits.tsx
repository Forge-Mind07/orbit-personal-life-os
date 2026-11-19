import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeader({ title, action, eyebrow }: { title: string; eyebrow?: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 px-1">
      <div>
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>}
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function LinkAction({ to, children }: { to: "/feed" | "/health" | "/finance" | "/chat" | "/settings" | "/connections"; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex min-h-10 items-center gap-0.5 rounded-full px-2 text-sm font-semibold text-primary hover:opacity-80">
      {children}
      <ChevronRight className="size-4" />
    </Link>
  );
}

export function Chip({ active, onClick, children, className, ariaLabel }: { active?: boolean; onClick?: () => void; children: ReactNode; className?: string; ariaLabel?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-all",
        active ? "border-transparent bg-foreground text-background" : "bg-surface text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: string }) {
  return (
    <div className="rounded-2xl bg-surface-2/60 p-3.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold tnum" style={tone ? { color: tone } : undefined}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function DemoTag({ children = "Demo" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
      {children}
    </span>
  );
}

export function PrimaryButton({ children, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}
export function GhostButton({ children, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-surface-2 px-5 text-sm font-semibold text-foreground transition-transform active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ChartTooltip({ active, payload, label, format }: { active?: boolean; payload?: { value: number; name?: string }[]; label?: string; format: (v: number) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-popover px-3 py-2 text-xs shadow-float">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-display text-sm font-semibold tnum">{format(payload[0].value)}</p>
    </div>
  );
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-5xl px-4 pt-2 sm:px-6", className)}>{children}</div>;
}
