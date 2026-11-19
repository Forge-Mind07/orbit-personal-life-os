import { Button } from "@/components/ui/button";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Bell, Menu } from "lucide-react";
import { titleFor, PRIMARY_NAV, SECONDARY_NAV } from "./nav";
import { useOrbit } from "@/lib/orbit/store";

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const { state } = useOrbit();
  const isTop = [...PRIMARY_NAV, ...SECONDARY_NAV].some((n) => n.to === path);
  const unread = 3 - state.readNotifications.length;
  return (
    <header className="glass sticky top-0 z-30 border-b" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-2 px-3 sm:px-5">
        {isTop ? (
          <Button variant="ghost" onClick={onMenu} className="grid size-11 place-items-center rounded-full hover:bg-surface-2 lg:hidden" aria-label="Open workspace menu">
            <Menu className="size-5" />
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => router.history.back()} className="grid size-11 place-items-center rounded-full hover:bg-surface-2" aria-label="Go back">
            <ArrowLeft className="size-5" />
          </Button>
        )}
        <h1 className="font-display text-lg font-semibold tracking-tight">{titleFor(path)}</h1>
        <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-finance/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-finance" title="All data is synthetic and not live">
          <span className="size-1.5 rounded-full bg-finance" /> Demo data
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Link to="/notifications" className="relative grid size-11 place-items-center rounded-full hover:bg-surface-2" aria-label={`Notifications, ${Math.max(0, unread)} unread`}>
            <Bell className="size-5" />
            {unread > 0 && <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-background" />}
          </Link>
          <Link to="/settings" className="grid size-9 place-items-center rounded-full bg-primary font-display text-sm font-bold text-on-accent" aria-label="Profile and settings">
            {state.name[0]}
          </Link>
        </div>
      </div>
    </header>
  );
}
