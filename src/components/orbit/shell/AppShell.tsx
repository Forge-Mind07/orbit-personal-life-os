import { useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { Orbit } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useOrbit } from "@/lib/orbit/store";
import { SidebarContent } from "./Sidebar";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-ambient" aria-busy="true" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="grid size-14 animate-pulse place-items-center rounded-3xl bg-primary text-primary-foreground">
          <Orbit className="size-7" />
        </div>
        <p className="text-sm text-muted-foreground">Preparing your demo workspace…</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { ready } = useOrbit();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();
  if (!ready) return <Splash />;
  return (
    <div className="orbit-shell min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r bg-sidebar lg:block">
        <SidebarContent />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[86vw] max-w-80 border-r bg-sidebar p-0">
          <SheetTitle className="sr-only">Workspace menu</SheetTitle>
          <SheetDescription className="sr-only">Navigate between ORBIT modules</SheetDescription>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="lg:pl-60">
        <TopBar onMenu={() => setOpen(true)} />

          <motion.main
            key={path}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pb-safe-nav lg:pb-12"
          >
            {children}
          </motion.main>

      </div>
      <BottomNav />
    </div>
  );
}
