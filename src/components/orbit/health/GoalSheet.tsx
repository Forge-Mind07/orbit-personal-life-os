import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { BottomSheet } from "../common/BottomSheet";
import { PrimaryButton } from "../common/bits";
import { useOrbit } from "@/lib/orbit/store";
import { formatNum } from "@/lib/orbit/format";
import { cn } from "@/lib/utils";

const PRESETS = [6000, 8000, 10000, 12000];

export function GoalSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { state, update } = useOrbit();
  const [goal, setGoal] = useState(state.stepGoal);
  useEffect(() => { if (open) setGoal(state.stepGoal); }, [open, state.stepGoal]);
  const clamp = (n: number) => Math.min(30000, Math.max(2000, n));
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Daily step target"
      description="Pick something that feels sustainable. You can change it anytime."
      footer={<PrimaryButton className="w-full" onClick={() => { update((s) => ({ ...s, stepGoal: goal })); toast.success(`Daily target set to ${formatNum(goal)} steps`); onOpenChange(false); }}>Save target</PrimaryButton>}
    >
      <div className="flex items-center justify-between gap-4">
        <button className="grid size-14 place-items-center rounded-2xl bg-surface-2" onClick={() => setGoal((g) => clamp(g - 500))} aria-label="Decrease by 500"><Minus className="size-5" /></button>
        <p className="font-display text-5xl font-bold tnum" aria-live="polite">{formatNum(goal)}</p>
        <button className="grid size-14 place-items-center rounded-2xl bg-surface-2" onClick={() => setGoal((g) => clamp(g + 500))} aria-label="Increase by 500"><Plus className="size-5" /></button>
      </div>
      <p className="mt-2 text-center text-sm text-muted-foreground">≈ {(goal * 0.000716).toFixed(1)} km per day</p>
      <div className="mt-6 grid grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <button key={p} onClick={() => setGoal(p)} aria-pressed={goal === p} className={cn("min-h-11 rounded-xl text-sm font-semibold", goal === p ? "bg-health text-on-accent" : "bg-surface-2 text-muted-foreground")}>
            {p / 1000}k
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
