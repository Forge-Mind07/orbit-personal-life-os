import type { ReactNode } from "react";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description?: string | undefined;
  children: ReactNode;
  footer?: ReactNode | undefined;
  className?: string;
}

export function BottomSheet({ open, onOpenChange, title, description, children, footer, className }: Props) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-overlay backdrop-blur-sm" />
        <Drawer.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-[28px] border border-b-0 bg-card outline-none",
            className,
          )}
        >
          <div className="mx-auto mt-3 h-1.5 w-11 shrink-0 rounded-full bg-surface-2" />
          <div className="flex items-start justify-between gap-4 px-6 pt-4">
            <div>
              <Drawer.Title className="font-display text-xl font-semibold tracking-tight">{title}</Drawer.Title>
              {description ? (
                <Drawer.Description className="mt-1 text-sm text-muted-foreground">{description}</Drawer.Description>
              ) : (
                <Drawer.Description className="sr-only">{title}</Drawer.Description>
              )}
            </div>
            <Drawer.Close className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-muted-foreground hover:text-foreground" aria-label="Close">
              <X className="size-4" />
            </Drawer.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-4 pt-5">{children}</div>
          {footer && <div className="border-t px-6 pt-4" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>{footer}</div>}
          {!footer && <div className="pb-safe" />}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
