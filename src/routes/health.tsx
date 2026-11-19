import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Footprints, MapPin, Pencil, Timer, Activity, Wind, Zap, PersonStanding } from "lucide-react";
import { useOrbit } from "@/lib/orbit/store";
import { TODAY_SAMPLE, seedDay } from "@/lib/orbit/activity";
import type { ISODate } from "@/lib/orbit/dates";
import { formatNum } from "@/lib/orbit/format";
import { ProgressRing } from "@/components/orbit/common/ProgressRing";
import { CountUp } from "@/components/orbit/common/CountUp";
import { SegmentTabs } from "@/components/orbit/common/SegmentTabs";
import { Page, SectionHeader } from "@/components/orbit/common/bits";
import { DayView, MonthView, WeekView, YearView } from "@/components/orbit/health/Views";
import { Insights } from "@/components/orbit/health/Insights";
import { DayInspector } from "@/components/orbit/health/DayInspector";
import { GoalSheet } from "@/components/orbit/health/GoalSheet";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Health · ORBIT" },
      { name: "description", content: "Steps, distance and movement with gentle weekly, monthly and yearly views." },
      { property: "og:title", content: "Health · ORBIT" },
      { property: "og:description", content: "Steps, distance and movement with gentle weekly, monthly and yearly views." },
    ],
  }),
  component: Health,
});

const VIEWS = ["Day", "Week", "Month", "Year"] as const;
type View = (typeof VIEWS)[number];

function Health() {
  const { state, today } = useOrbit();
  const [view, setView] = useState<View>("Week");
  const [sel, setSel] = useState<ISODate | null>(null);
  const [goalOpen, setGoalOpen] = useState(false);
  const day = seedDay(today, today);
  const steps = day.steps ?? 0;
  const goal = state.stepGoal;
  const pct = Math.round((steps / goal) * 100);
  const b = TODAY_SAMPLE.breakdown;
  const types = [
    { label: "Everyday", sub: "Not a workout", steps: b.everyday, min: Math.round(b.everyday / 180), icon: PersonStanding, c: "var(--feed)" },
    { label: "Walking", sub: "Brisk walks", steps: b.brisk, min: Math.round(b.brisk / 105), icon: Wind, c: "var(--health)" },
    { label: "Jogging", sub: "Easy pace", steps: b.jog, min: Math.round(b.jog / 155), icon: Activity, c: "var(--primary)" },
    { label: "Running", sub: "None today", steps: b.run, min: Math.round(b.run / 175), icon: Zap, c: "var(--finance)" },
  ];

  return (
    <Page className="space-y-7 pt-6">
      <section className="card-orbit relative overflow-hidden p-6 sm:p-8">
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Today · sample day</p>
            <p className="mt-1 text-sm text-muted-foreground">Target {formatNum(goal)} steps</p>
          </div>
          <Button variant="ghost" onClick={() => setGoalOpen(true)} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-surface-2 px-3.5 text-sm font-semibold" aria-label="Edit daily step target"><Pencil className="size-3.5" /> Target</Button>
        </div>
        <div className="relative mt-2 flex justify-center">
          <ProgressRing value={steps / goal} size={240} stroke={10} label={`${steps} of ${goal} steps today, ${pct}%`}>
            <div>
              <Footprints className="mx-auto size-6 text-health" />
              <p className="mt-1 font-display text-6xl font-bold tracking-tighter"><CountUp value={steps} /></p>
              <p className="text-sm font-semibold text-health">{pct}% of target</p>
            </div>
          </ProgressRing>
        </div>
        <div className="relative mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-surface-2/60 p-3"><MapPin className="mx-auto size-4 text-feed" /><p className="mt-1.5 font-display text-lg font-semibold tnum">{day.distanceKm} km</p><p className="text-[11px] text-muted-foreground">Distance</p></div>
          <div className="rounded-2xl bg-surface-2/60 p-3"><Timer className="mx-auto size-4 text-primary" /><p className="mt-1.5 font-display text-lg font-semibold tnum">{day.activeMin} min</p><p className="text-[11px] text-muted-foreground">Moving</p></div>
          <div className="rounded-2xl bg-surface-2/60 p-3"><Footprints className="mx-auto size-4 text-health" /><p className="mt-1.5 font-display text-lg font-semibold tnum">{formatNum(Math.max(0, goal - steps))}</p><p className="text-[11px] text-muted-foreground">To go</p></div>
        </div>
        <p className="relative mt-5 text-center text-sm text-muted-foreground">{steps >= goal ? "Target reached. Lovely work, enjoy the rest of your evening." : "You're well on your way. Every few hundred steps counts."}</p>
      </section>

      <section>
        <SectionHeader title="How you moved" eyebrow="Activity types today" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {types.map((t) => (
            <div key={t.label} className="card-orbit p-4">
              <span className="grid size-10 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${t.c} 16%, transparent)`, color: t.c }}><t.icon className="size-5" /></span>
              <p className="mt-3 font-display text-2xl font-semibold tnum">{formatNum(t.steps)}</p>
              <p className="text-sm font-semibold">{t.label}</p>
              <p className="text-xs text-muted-foreground">{t.min > 0 ? `${t.min} min · ` : ""}{t.sub}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 px-1 text-xs text-muted-foreground">Everyday steps from chores and commuting are tracked separately from workouts.</p>
      </section>

      <section>
        <SegmentTabs id="health" label="Time range" options={VIEWS} value={view} onChange={setView} className="mb-5" />
        <div role="tabpanel" aria-label={`${view} view`}>
          {view === "Day" && <DayView />}
          {view === "Week" && <WeekView onSelect={setSel} />}
          {view === "Month" && <MonthView onSelect={setSel} />}
          {view === "Year" && <YearView />}
        </div>
      </section>

      <section>
        <SectionHeader title="Insights" eyebrow="From your activity" />
        <Insights />
      </section>

      <DayInspector date={sel} onClose={() => setSel(null)} />
      <GoalSheet open={goalOpen} onOpenChange={setGoalOpen} />
    </Page>
  );
}
