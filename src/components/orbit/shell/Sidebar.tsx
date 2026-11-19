import { Link, useRouterState } from "@tanstack/react-router";
import { FlaskConical, Orbit } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, SECONDARY_NAV, isActive, type NavItem } from "./nav";
import { useOrbit } from "@/lib/orbit/store";

function Row({ item, path, onNavigate }: { item: NavItem; path: string; onNavigate?: (() => void) | undefined }) {
  const active = isActive(item.to, path);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors",
        active ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
      )}
    >
      <span className="grid size-8 place-items-center rounded-lg" style={{ color: active ? item.tone : undefined }}>
        <Icon className="size-[18px]" />
      </span>
      {item.label}
      {active && <span className="ml-auto size-1.5 rounded-full" style={{ background: item.tone }} />}
    </Link>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { state } = useOrbit();
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center gap-3 px-2 pt-2">
        <div className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Orbit className="size-5" />
        </div>
        <div>
          <p className="font-display text-base font-bold tracking-tight">ORBIT</p>
          <p className="text-xs text-muted-foreground">Personal Life OS</p>
        </div>
      </div>
      <nav aria-label="Workspace" className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Workspace</p>
        {PRIMARY_NAV.map((n) => <Row key={n.to} item={n} path={path} onNavigate={onNavigate} />)}
      </nav>
      <nav aria-label="System" className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">System</p>
        {SECONDARY_NAV.map((n) => <Row key={n.to} item={n} path={path} onNavigate={onNavigate} />)}
      </nav>
      <div className="mt-auto rounded-2xl border border-dashed border-primary/40 bg-accent/40 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-accent-foreground">
          <FlaskConical className="size-4" /> Demo prototype
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          All data is synthetic and not live. Nothing is connected to your real accounts.
        </p>
      </div>
      <div className="flex items-center gap-3 px-2 pb-2">
        <div className="grid size-9 place-items-center rounded-full bg-surface-2 font-display text-sm font-bold">{state.name[0]}</div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{state.name}</p>
          <p className="truncate text-xs text-muted-foreground">{state.city}, Tamil Nadu</p>
        </div>
      </div>
    </div>
  );
}
