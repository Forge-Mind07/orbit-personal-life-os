import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MotionConfig, AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, MapPin, Timer, Play, Pencil, Orbit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrbit } from "@/lib/orbit/store";
import { seedDay } from "@/lib/orbit/activity";
import { fmt, type ISODate } from "@/lib/orbit/dates";
import { formatNum } from "@/lib/orbit/format";
import { ProgressRing } from "@/components/orbit/common/ProgressRing";
import { SegmentTabs } from "@/components/orbit/common/SegmentTabs";
import { DayView, MonthView, WeekView, YearView } from "@/components/orbit/health/Views";
import { Insights } from "@/components/orbit/health/Insights";
import { DayInspector } from "@/components/orbit/health/DayInspector";
import { GoalSheet } from "@/components/orbit/health/GoalSheet";
import { StepTracker, DateStrip, recentDates } from "@/components/orbit/health/StepTracker";
import { ActivityDetail } from "@/components/orbit/health/ActivityDetail";
import { StartActivity } from "@/components/orbit/health/StartActivity";
import { HealthReveal } from "@/components/orbit/health/HealthMotion";
import { PaceCompanion } from "@/components/orbit/health/PaceCompanion";
import "@/components/orbit/health/health.css";

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
  const reduce = useReducedMotion();
  const [view, setView] = useState<View>("Week");
  const [selected, setSelected] = useState<ISODate>(today);
  const [inspected, setInspected] = useState<ISODate | null>(null);
  const [goalOpen, setGoalOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [detail, setDetail] = useState(false);
  const day = seedDay(selected, today);
  const steps = day.steps ?? 0;
  const goal = state.stepGoal;
  const dates = recentDates(today);
  const pct = Math.round(steps / goal * 100);
  return <MotionConfig reducedMotion="user"><div className="health-area health-page">
    <header className="health-header">
      <div><p className="health-kicker"><Orbit className="size-3.5" /> ORBIT HEALTH <span> / SYNTHETIC DEMO</span></p><h1>{detail ? "My Activity" : "Your Movement"}<span className="health-heading-dot">.</span></h1><p className="health-greeting">A little more energy, {state.name}.</p></div>
      <Button variant="secondary" size="icon" className="health-start-icon" onClick={() => setStartOpen(true)} aria-label="Start Activity" title="Start Activity"><Play /></Button>
    </header>
    <div className="health-date-heading"><p>{fmt(selected, "EEEE, d MMM")}</p><Button variant="ghost" onClick={() => setSelected(today)} disabled={selected === today}>Today</Button></div>
    <DateStrip dates={dates} selected={selected} onSelect={setSelected} id="overview" />
    <PaceCompanion day={day} enabled={!startOpen} />
    <div className="health-layout">
      <div className="health-primary-column">
        <HealthReveal><StepTracker today={today} selected={selected} goal={goal} dates={dates} onSelect={setSelected} onEdit={() => setGoalOpen(true)} /></HealthReveal>
        <HealthReveal delay={0.08}>
          <div className="health-section-title"><h2>Progress</h2><Button variant="ghost" onClick={() => { setDetail((d) => !d); document.querySelector(detail ? ".health-header" : ".health-activity-detail")?.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" }); }}>{detail ? "Overview" : "My Activity"}<ArrowUpRight /></Button></div>
          <div className="health-progress-row"><div><p>Daily steps</p><strong>{day.steps === null ? "No data" : `${pct}%`} <span>{day.steps === null ? "" : "of your target"}</span></strong></div><ProgressRing size={64} stroke={4} value={steps / goal} color="var(--foreground)" label={`${steps} of ${goal} steps`}><span className="text-xs font-bold">{day.steps === null ? "—" : `${pct}%`}</span></ProgressRing></div>
          <div className="health-small-metrics"><div><MapPin /><span>Distance</span><strong>{day.distanceKm} <small>km</small></strong></div><div><Timer /><span>Moving</span><strong>{day.activeMin} <small>min</small></strong></div></div>
          <p className="health-support">{day.steps === null ? "No data for this day. It isn't counted as a missed day." : steps >= goal ? "Target reached. Take a breath and enjoy the feeling." : selected === today ? "Every little step adds up. You're on your way." : "A softer day is part of the bigger picture."}</p>
          <div className="health-actions"><Button onClick={() => setStartOpen(true)}><Play />Start Activity</Button><Button variant="outline" onClick={() => setInspected(selected)}>Day details<ArrowUpRight /></Button></div>
        </HealthReveal>
      </div>
      <div className="health-secondary-column"><ActivityDetail day={day} /></div>
    </div>
    <section className="health-history">
      <div className="health-section-title"><h2>Your rhythm</h2><Button variant="ghost" size="icon" onClick={() => setGoalOpen(true)} aria-label="Edit target" title="Edit target"><Pencil /></Button></div>
      <SegmentTabs id="health" label="Time range" options={VIEWS} value={view} onChange={setView} className="health-range-tabs" />
      <AnimatePresence mode="wait" initial={false}><motion.div key={view} role="tabpanel" aria-label={`${view} view`} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.16 }}>
        {view === "Day" && <DayView />}{view === "Week" && <WeekView onSelect={setInspected} />}{view === "Month" && <MonthView onSelect={setInspected} />}{view === "Year" && <YearView />}
      </motion.div></AnimatePresence>
    </section>
    <section className="health-insights"><div className="health-section-title"><h2>A little perspective</h2><span>FROM YOUR ACTIVITY</span></div><Insights /></section>
    <DayInspector date={inspected} onClose={() => setInspected(null)} />
    <GoalSheet open={goalOpen} onOpenChange={setGoalOpen} />
    <StartActivity open={startOpen} onOpenChange={setStartOpen} day={day} />
    <p className="health-bottom-note">ORBIT Health · demo only · no connected sensors</p>
  </div></MotionConfig>;
}
