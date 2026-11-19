import type { ReactNode } from "react";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HealthSheet({ open, onOpenChange, title, description, children, footer }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: ReactNode; footer?: ReactNode }) {
  return <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
    <Drawer.Portal>
      <Drawer.Overlay className="health-sheet-overlay fixed inset-0 z-50" />
      <Drawer.Content className="health-area health-sheet fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col outline-none">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border" />
        <header className="flex items-start justify-between gap-3 px-6 pt-5">
          <div><Drawer.Title className="text-xl font-bold">{title}</Drawer.Title><Drawer.Description className={description ? "mt-2 text-sm text-muted-foreground" : "sr-only"}>{description || title}</Drawer.Description></div>
          <Drawer.Close asChild><Button variant="secondary" size="icon" aria-label="Close" className="shrink-0"><X /></Button></Drawer.Close>
        </header>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="health-sheet-footer border-t px-6 pt-4">{footer}</div>}
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>;
}