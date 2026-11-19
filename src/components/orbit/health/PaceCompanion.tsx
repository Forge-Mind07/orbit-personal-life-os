import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Shirt, Sparkles, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrbit } from "@/lib/orbit/store";
import { PACE_OUTFITS, paceContext, type PaceAction } from "@/lib/orbit/pace";
import type { DayActivity } from "@/lib/orbit/activity";
import { PaceMascot } from "./PaceMascot";

export function PaceCompanion({ day, preview = false, enabled = true }: { day: DayActivity; preview?: boolean; enabled?: boolean }) {
  const { state, today, update } = useOrbit();
  const context = paceContext(day, state.stepGoal, today);
  const [action, setAction] = useState<PaceAction>("idle");
  const [wardrobe, setWardrobe] = useState(false);
  const [feedback, setFeedback] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inView = useInView(ref, { amount: 0.15 });
  const reduce = useReducedMotion();
  const [foreground, setForeground] = useState(true);
  useEffect(() => {
    const sync = () => setForeground(!document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  const outfit = PACE_OUTFITS.find((o) => o === state.paceOutfit) ?? "apricot";
  const clearTimer = () => { if (timer.current) clearTimeout(timer.current); };
  useEffect(() => {
    setAction("idle"); setFeedback("");
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [day.date, state.stepGoal, enabled]);
  const trigger = (next: PaceAction) => {
    clearTimer();
    setAction(next);
    setFeedback(next === "wave" ? "Hey, you! I'm in your corner." : next === "run" ? "Let's find our stride. Just a demo preview." : next === "celebrate" ? "You did it! Here's a little happy dance." : next === "cheer" ? "You've got this. One easy step at a time." : "Taking a breather. Your totals haven't changed.");
    if (next !== "run" && next !== "idle") timer.current = setTimeout(() => { setAction("idle"); setFeedback(""); }, 2200);
  };
  const visibleAction = enabled ? action : "idle";
  return <div ref={ref} className={`pace-companion pace-outfit-${outfit} ${preview ? "pace-preview" : ""}`} data-mood={context.mood} data-action={visibleAction}>
    <div className="pace-companion-copy">
      <p className="pace-eyebrow">{preview ? "ACTIVITY DEMO PREVIEW" : "YOUR MOVEMENT COMPANION"}</p>
      <h2>{preview ? "Find your stride." : "Meet Pace."}</h2>
      <p className="pace-speech" aria-live="polite">{feedback || context.message}</p>
      <div className="pace-controls">
        <Button variant="ghost" className="pace-cheer-control" onClick={() => trigger(context.mood === "complete" ? "celebrate" : "cheer")}><Sparkles />{context.mood === "complete" ? "Celebrate" : "Cheer me on"}</Button>
        <Button variant="ghost" className="pace-run-control" aria-pressed={visibleAction === "run"} onClick={() => trigger(visibleAction === "run" ? "idle" : "run")}>{visibleAction === "run" ? <Pause /> : <Play />}{visibleAction === "run" ? "Pause preview" : preview ? "Start activity preview" : "Let's move"}</Button>
      </div>
      <p className="pace-disclaimer">{visibleAction === "run" ? "Preview playing · no activity is recorded" : "Demo companion · your pace, no pressure"}</p>
    </div>
    <Button variant="ghost" className="pace-character-button" aria-label="Say hello to Pace" onClick={() => trigger("wave")} onPointerMove={(event) => {
      if (reduce || event.pointerType !== "mouse") return;
      const box = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--pace-gaze", `${Math.max(-2, Math.min(2, ((event.clientX - box.left) / box.width - 0.5) * 4))}px`);
    }} onPointerLeave={(event) => event.currentTarget.style.setProperty("--pace-gaze", "0px")}>
      <PaceMascot action={visibleAction} mood={context.mood} active={enabled && inView && foreground && !reduce} />
    </Button>
    <Button variant="ghost" size="icon" className="pace-wardrobe-toggle" aria-label="Customize Pace's outfit" aria-expanded={wardrobe} onClick={() => setWardrobe((v) => !v)} title="Customize Pace's outfit"><Shirt /></Button>
    {wardrobe && <fieldset className="pace-wardrobe"><legend>Pace's wardrobe</legend><div>{PACE_OUTFITS.map((o) => <Button key={o} variant="ghost" aria-pressed={o === outfit} aria-label={`${o} outfit`} className={`pace-outfit-${o}`} onClick={() => update((s) => ({ ...s, paceOutfit: o }))}><span className="pace-swatch" /><span>{o}</span></Button>)}</div><p>Saved on this device. No points. Just you.</p></fieldset>}
  </div>;
}