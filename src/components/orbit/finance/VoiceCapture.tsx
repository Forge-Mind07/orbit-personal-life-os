import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Mic, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { parseExpense } from "@/lib/orbit/parser";
import { useOrbit } from "@/lib/orbit/store";
import { fmt, relativeDayLabel } from "@/lib/orbit/dates";
import { formatINR } from "@/lib/orbit/format";
import { GhostButton, PrimaryButton } from "../common/bits";
import { CATEGORY_ICON } from "./icons";
import { categoryColor } from "@/lib/orbit/finance";
import type { ExpenseDraft } from "./AddExpenseSheet";

const SAMPLE = "Spent 180 rupees on lunch today";

export function VoiceCapture({ open, onClose, onEdit }: { open: boolean; onClose: () => void; onEdit: (d: Partial<ExpenseDraft>) => void }) {
  const { today, addExpense } = useOrbit();
  const [phase, setPhase] = useState<"listening" | "review">("listening");
  const [text, setText] = useState("");

  useEffect(() => {
    if (!open) return;
    setPhase("listening");
    setText("");
    let i = 0;
    const typer = setInterval(() => {
      i++;
      setText(SAMPLE.slice(0, i));
      if (i >= SAMPLE.length) { clearInterval(typer); setTimeout(() => setPhase("review"), 450); }
    }, 55);
    return () => clearInterval(typer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  const parsed = useMemo(() => parseExpense(text, today), [text, today]);
  const Icon = CATEGORY_ICON[parsed.category];

  const confirm = () => {
    if (!parsed.amount) return;
    addExpense({ amount: parsed.amount, description: parsed.description, category: parsed.category, date: parsed.date, payment: parsed.payment, source: "voice" });
    toast.success(`${formatINR(parsed.amount)} saved from voice entry`, { description: `${parsed.description} · ${parsed.category}` });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div role="dialog" aria-modal="true" aria-label="Simulated voice expense entry" className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex items-center justify-between px-4" style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}>
            <span className="rounded-full border border-finance/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-finance">Simulated voice · no microphone used</span>
            <button onClick={onClose} className="grid size-11 place-items-center rounded-full bg-surface-2" aria-label="Close voice entry"><X className="size-5" /></button>
          </div>
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6">
            <div className="flex flex-col items-center">
              <div className="relative grid size-28 place-items-center">
                {phase === "listening" && <span className="absolute inset-0 animate-ping rounded-full bg-finance/20" />}
                <span className="relative grid size-24 place-items-center rounded-full bg-finance text-on-accent shadow-float"><Mic className="size-10" /></span>
              </div>
              <div className="mt-8 flex h-14 items-center gap-1" aria-hidden>
                {Array.from({ length: 28 }, (_, i) => (
                  <span key={i} className={phase === "listening" ? "animate-wave w-1 rounded-full bg-finance" : "w-1 rounded-full bg-finance/30"} style={{ height: `${20 + ((i * 37) % 36)}px`, animationDelay: `${(i % 7) * 0.09}s` }} />
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">{phase === "listening" ? "Listening… (playing a sample phrase)" : "Here's what Orbit heard. Edit anything before saving."}</p>
            </div>
            <label className="mt-8 block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transcript</span>
              <textarea value={text} onChange={(e) => { setText(e.target.value); setPhase("review"); }} rows={2} className="mt-2 w-full resize-none rounded-2xl border bg-surface p-4 font-display text-xl font-medium outline-none focus:border-primary" />
            </label>
            {phase === "review" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-orbit mt-4 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parsed by rules</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-surface-2"><Icon className="size-5" style={{ color: categoryColor(parsed.category) }} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{parsed.description}</p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground"><CalendarDays className="size-3.5" /> {relativeDayLabel(parsed.date, today)}, {fmt(parsed.date, "d MMM")} · {parsed.category} · {parsed.payment}</p>
                  </div>
                  <p className="font-display text-2xl font-bold tnum">{parsed.amount ? formatINR(parsed.amount) : "—"}</p>
                </div>
                {!parsed.amount && <p className="mt-3 text-sm text-destructive">No amount found. Try including a number, e.g. "180 rupees".</p>}
              </motion.div>
            )}
          </div>
          <div className="mx-auto flex w-full max-w-md gap-3 px-6" style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}>
            <GhostButton className="flex-1" disabled={phase !== "review"} onClick={() => { onEdit({ amount: parsed.amount ? String(parsed.amount) : "", description: parsed.description, category: parsed.category, date: parsed.date, payment: parsed.payment, source: "voice" }); }}>
              <Pencil className="size-4" /> Edit details
            </GhostButton>
            <PrimaryButton className="flex-1" disabled={phase !== "review" || !parsed.amount} onClick={confirm}>Confirm & save</PrimaryButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
