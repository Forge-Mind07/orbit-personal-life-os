import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Activity, Droplets, Flame, Footprints, Wind, Zap, PersonStanding } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DayActivity } from "@/lib/orbit/activity";
import { formatNum } from "@/lib/orbit/format";
import { CountUp } from "../common/CountUp";
import { HealthReveal } from "./HealthMotion";

export function ActivityDetail({ day }: { day: DayActivity }) {
  const reduce = useReducedMotion();
  const [kind, setKind] = useState<"everyday" | "brisk" | "jog" | "run">("brisk");
  const types = [
    { key: "everyday" as const, name: "Everyday", icon: PersonStanding, divisor: 180 },
    { key: "brisk" as const, name: "Walking", icon: Wind, divisor: 105 },
    { key: "jog" as const, name: "Jogging", icon: Activity, divisor: 155 },
    { key: "run" as const, name: "Running", icon: Zap, divisor: 175 },
  ];
  const type = types.find((t) => t.key === kind);
  return <section className="health-activity-detail">
    <div className="health-section-title"><h2>My Activity</h2><span>YOUR DAILY PICTURE</span></div>
    <div className="health-detail-bento">
      <HealthReveal className="health-heart-card" delay={0.05}>
        <div className="flex items-center gap-2"><Activity className="size-4" /><h3>Heart rhythm</h3></div>
        <svg viewBox="0 0 280 130" className="health-heart-wave" role="img" aria-label="Illustrative heart rhythm waveform, not measured">
          <path d="M0 76C12 76 12 48 25 48S36 97 47 97 60 73 70 73L89 73 98 66 106 83 119 20 132 113 145 68 164 76C178 76 178 48 190 48S203 97 215 97 225 73 239 73L280 73" fill="none" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <motion.path d="M0 76C12 76 12 48 25 48S36 97 47 97 60 73 70 73L89 73 98 66 106 83 119 20 132 113 145 68 164 76C178 76 178 48 190 48S203 97 215 97 225 73 239 73L280 73" fill="none" stroke="var(--surface)" strokeWidth="3" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 2.5 }} />
        </svg>
        <p className="health-metric-number">123 <span>bpm</span></p><p className="health-demo-note">Illustrative demo · not measured</p>
      </HealthReveal>
      <HealthReveal className="health-metric-card" delay={0.1}><Footprints className="size-5" /><h3>Steps</h3><p className="health-metric-number">{day.steps === null ? "—" : <CountUp value={day.steps} duration={650} />}</p><p className="health-demo-note">{day.steps === null ? "No data" : "Synthetic activity"}</p></HealthReveal>
      <HealthReveal className="health-metric-card" delay={0.15}><Droplets className="size-5" /><h3>Water</h3><p className="health-metric-number">1.5 <span>Litres</span></p><p className="health-demo-note">Illustrative demo · not logged</p></HealthReveal>
    </div>
    <HealthReveal className="health-calories" delay={0.1}>
      <div className="flex items-center justify-between"><h3 className="flex items-center gap-2"><Flame className="size-4" />Daily calorie intake</h3><span className="health-demo-note">Illustrative demo</span></div>
      <p className="health-metric-number mt-4">848 <span>kcal</span></p>
      <div className="health-calorie-meter" role="img" aria-label="Illustrative intake meter, 848 of 2000 kilocalories"><motion.span initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 0.9 }} /></div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>Sample intake</span><span>2,000 kcal example</span></div>
      <div className="health-nutrients">{[{ name: "Carbs", amount: "106 g", pct: 0.53 }, { name: "Protein", amount: "42 g", pct: 0.42 }, { name: "Fat", amount: "28 g", pct: 0.4 }].map((n) => <div key={n.name}><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="14" fill="none" stroke="var(--track)" strokeWidth="3" /><circle cx="18" cy="18" r="14" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray={`${n.pct * 88} 88`} transform="rotate(-90 18 18)" /></svg><span>{n.name}</span><i /><strong>{n.amount}</strong></div>)}</div>
      <p className="health-demo-note mt-3">Nutrition and water are display samples, not tracked or inferred from steps.</p>
    </HealthReveal>
    <div className="health-section-title mt-6"><h2>How you moved</h2></div>
    <div className="health-movement-tabs" aria-label="Movement type">{types.map((t) => <Button variant="ghost" key={t.key} aria-pressed={kind === t.key} onClick={() => setKind(t.key)}><t.icon /><span>{t.name}</span></Button>)}</div>
    <div className="health-movement-summary" aria-live="polite"><strong>{formatNum(day.breakdown[kind])} <span>steps</span></strong><span>{Math.round(day.breakdown[kind] / (type?.divisor ?? 180))} min · {kind === "everyday" ? "Chores & commuting, not a workout" : kind === "brisk" ? "Brisk walks" : kind === "jog" ? "Easy pace" : day.breakdown.run ? "Running" : "No running recorded"}</span></div>
  </section>;
}