import { motion } from "motion/react";
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
  return (
    <div role="tablist" aria-label={label} className={cn("flex rounded-2xl bg-surface-2 p-1", className)}>
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o)}
            className={cn(
              "relative min-h-10 flex-1 rounded-xl px-3 text-sm font-semibold transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-xl bg-surface shadow-float"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{o}</span>
          </button>
        );
      })}
    </div>
  );
}
