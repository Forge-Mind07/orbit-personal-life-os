import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface Props<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  id: string;
  label: string;
  className?: string;
}

export function SegmentTabs<T extends string>({ options, value, onChange, id, label, className }: Props<T>) {
  const reduce = useReducedMotion();
  return (
    <div role="tablist" aria-label={label} className={cn("flex border-b border-border p-1", className)}>
      {options.map((o) => {
        const active = o === value;
        return (
          <Button variant="ghost"
            key={o}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o)}
            className={cn(
              "relative min-h-10 flex-1 rounded-xl px-3 text-sm font-semibold transition-colors",
              active ? "text-primary-foreground hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-xl bg-primary"
                transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <span className="relative">{o}</span>
          </Button>
        );
      })}
    </div>
  );
}
