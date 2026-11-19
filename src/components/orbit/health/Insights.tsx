import { HealthReveal } from "./HealthMotion";
import { Sparkles } from "lucide-react";
import { computeInsights } from "@/lib/orbit/activity";
import { useOrbit } from "@/lib/orbit/store";
import { useMemo } from "react";

const TONE = { health: "var(--health)", violet: "var(--primary)", feed: "var(--feed)", finance: "var(--finance)" };

export function Insights() {
  const { state, today } = useOrbit();
  const list = useMemo(() => computeInsights(state.stepGoal, today), [state.stepGoal, today]);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {list.map((i) => (
        <HealthReveal key={i.id}><article className="card-orbit relative overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <Sparkles className="size-4" style={{ color: TONE[i.tone] }} />
            <span className="font-display text-sm font-bold tnum" style={{ color: TONE[i.tone] }}>{i.metric}</span>
          </div>
          <h3 className="mt-3 font-semibold">{i.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{i.body}</p>
        </article></HealthReveal>
      ))}
    </div>
  );
}
