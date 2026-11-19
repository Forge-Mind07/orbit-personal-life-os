import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Footprints, MapPin, Sparkles, Timer } from "lucide-react";
import { useOrbit } from "@/lib/orbit/store";
import { dayStatus, seedDay, weekDates } from "@/lib/orbit/activity";
import { fmt } from "@/lib/orbit/dates";
import { cumulativeDaily, inMonth, portfolioSummary, sumAmounts, valueSeries } from "@/lib/orbit/finance";
import { briefingFor, cityize } from "@/lib/orbit/feed";
import { formatINR, formatNum, formatPct } from "@/lib/orbit/format";
import { ProgressRing } from "@/components/orbit/common/ProgressRing";
import { CountUp } from "@/components/orbit/common/CountUp";
import { Sparkline } from "@/components/orbit/common/Sparkline";
import { ArticleThumb } from "@/components/orbit/common/ArticleThumb";
import { LinkAction, Page, SectionHeader } from "@/components/orbit/common/bits";
import { DayInspector } from "@/components/orbit/health/DayInspector";
import { STATUS_COLOR, STATUS_LABEL } from "@/components/orbit/health/statusStyle";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home · ORBIT" },
      { name: "description", content: "Your day at a glance: steps, spending, portfolio and a calm daily briefing." },
      { property: "og:title", content: "Home · ORBIT — Personal Life OS" },
      { property: "og:description", content: "Your day at a glance: steps, spending, portfolio and a calm daily briefing." },
    ],
  }),
  component: Home,
});

function greeting(h: number) {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Home() {
  const { state, today, allExpenses } = useOrbit();
  const reduce = useReducedMotion();
  const [sel, setSel] = useState<string | null>(null);
  const goal = state.stepGoal;
  const todayDay = seedDay(today, today);
  const steps = todayDay.steps ?? 0;
  const pct = Math.round((steps / goal) * 100);
  const left = Math.max(0, goal - steps);
  const week = weekDates(today).map((d) => { const day = seedDay(d, today); return { day, status: dayStatus(day, goal, today) }; });
  const month = allExpenses.filter((e) => inMonth(e, today));
  const spent = sumAmounts(month);
  const cumul = useMemo(() => cumulativeDaily(month, today).map((c) => c.total), [month, today]);
  const pf = portfolioSummary();
  const pfSeries = useMemo(() => valueSeries("portfolio", pf.value, "1M", today).map((s) => s.value), [pf.value, today]);
  const stories = briefingFor(state.topics);
  const hour = new Date().getHours();

  const rise = (i: number) => (reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.05 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } });

  return (
    <Page className="space-y-8 pt-6">
      <motion.header {...rise(0)} className="px-1">
        <p className="text-sm font-medium text-muted-foreground">{fmt(today, "EEEE, d MMMM")} · {state.city}</p>
        <h2 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{greeting(hour)}, {state.name}.</h2>
      </motion.header>

      <motion.section {...rise(1)} className="card-orbit relative overflow-hidden p-6 sm:p-8" aria-labelledby="today-steps">
        <span className="absolute -right-20 -top-20 size-64 rounded-full bg-health/15 blur-3xl" />
        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
          <Link to="/health" aria-label="Open health details">
            <ProgressRing value={steps / goal} size={232} stroke={20} label={`${steps} of ${goal} steps, ${pct}% complete`}>
              <div>
                <Footprints className="mx-auto size-5 text-health" />
                <p id="today-steps" className="mt-1 font-display text-5xl font-bold tracking-tight"><CountUp value={steps} /></p>
                <p className="text-sm text-muted-foreground">/ {formatNum(goal)} steps</p>
              </div>
            </ProgressRing>
          </Link>
          <div className="w-full flex-1 text-center sm:text-left">
            <p className="inline-flex rounded-full bg-health/15 px-3 py-1 text-sm font-bold text-health">{pct}% complete</p>
            <p className="mt-4 text-lg font-medium leading-snug">
              {left > 0 ? <>About <span className="font-bold tnum">{formatNum(left)}</span> steps to go. An easy evening stroll would close it out.</> : "Goal reached. Anything more today is a bonus."}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-surface-2/60 p-3.5 text-left"><MapPin className="size-4 text-feed" /><p className="mt-2 font-display text-xl font-semibold tnum">{todayDay.distanceKm} km</p><p className="text-xs text-muted-foreground">Distance</p></div>
              <div className="rounded-2xl bg-surface-2/60 p-3.5 text-left"><Timer className="size-4 text-primary" /><p className="mt-2 font-display text-xl font-semibold tnum">{todayDay.activeMin} min</p><p className="text-xs text-muted-foreground">Moving</p></div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section {...rise(2)}>
        <SectionHeader title="This week" action={<LinkAction to="/health">Activity</LinkAction>} />
        <div className="card-orbit grid grid-cols-7 gap-1 p-3">
          {week.map(({ day, status }) => {
            const h = day.steps ? Math.max(0.08, Math.min(1, day.steps / goal)) : 0.06;
            return (
              <button key={day.date} onClick={() => setSel(day.date)} className={cn("flex min-h-28 flex-col items-center justify-end gap-2 rounded-2xl py-2 transition-colors hover:bg-surface-2", status === "today" && "bg-surface-2/70")} aria-label={`${fmt(day.date, "EEEE")}: ${STATUS_LABEL[status]}${day.steps ? `, ${day.steps} steps` : ""}`}>
                <div className="relative flex h-16 w-3 items-end overflow-hidden rounded-full bg-track" style={{ background: "var(--track)" }}>
                  <motion.span className="w-full rounded-full" style={{ background: STATUS_COLOR[status] }} initial={reduce ? false : { height: 0 }} animate={{ height: `${h * 100}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
                </div>
                <span className={cn("text-xs font-semibold", status === "today" ? "text-foreground" : "text-muted-foreground")}>{fmt(day.date, "EEEEE")}</span>
              </button>
            );
          })}
        </div>
      </motion.section>

      <motion.section {...rise(3)} className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
        <Link to="/finance" className="card-orbit block p-5 transition-transform active:scale-[0.99]">
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-muted-foreground">Spent this month</p><ArrowUpRight className="size-4 text-muted-foreground" /></div>
          <p className="mt-2 font-display text-3xl font-bold tnum">{formatINR(spent)}</p>
          <p className="text-xs text-muted-foreground">of {formatINR(state.budget)} · {Math.round((spent / state.budget) * 100)}% used</p>
          <div className="mt-3"><Sparkline id="home-spend" data={cumul.length > 1 ? cumul : [0, spent]} color="var(--finance)" /></div>
        </Link>
        <Link to="/finance" className="card-orbit block p-5 transition-transform active:scale-[0.99]">
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-muted-foreground">Portfolio</p><ArrowUpRight className="size-4 text-muted-foreground" /></div>
          <p className="mt-2 font-display text-3xl font-bold tnum">{formatINR(pf.value)}</p>
          <p className="text-xs font-semibold text-health">{formatPct(pf.pnlPct)} all time · demo</p>
          <div className="mt-3"><Sparkline id="home-pf" data={pfSeries} color="var(--primary)" /></div>
        </Link>
      </motion.section>

      <motion.section {...rise(4)}>
        <SectionHeader title="Your briefing" eyebrow="Illustrative demo stories" action={<LinkAction to="/feed">Feed</LinkAction>} />
        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0">
          {stories.map((a, i) => (
            <Link key={a.id} to="/article/$id" params={{ id: a.id }} className="card-orbit w-[78%] shrink-0 snap-start overflow-hidden sm:w-auto">
              <ArticleThumb hues={a.hues} seed={i} className="h-28" />
              <div className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-feed">{a.scope} · {a.topic}</p>
                <p className="mt-1.5 line-clamp-2 font-semibold leading-snug">{cityize(a.title, state.city)}</p>
                <p className="mt-2 text-xs text-muted-foreground">{a.readMin} min read</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      <motion.section {...rise(5)}>
        <Link to="/chat" className="group relative block overflow-hidden rounded-[28px] border border-primary/30 p-6" style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--primary) 22%, var(--surface)), var(--surface) 60%)" }}>
          <span className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/30 blur-3xl transition-transform duration-700 group-hover:scale-125" />
          <div className="relative flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" /> Demo assistant</div>
          <p className="relative mt-3 font-display text-2xl font-bold tracking-tight">Ask Orbit anything</p>
          <p className="relative mt-1 text-sm text-muted-foreground">"How did I do this week?" · "Where's my money going?"</p>
          <div className="relative mt-5 flex min-h-12 items-center rounded-2xl border bg-background/60 px-4 text-sm text-muted-foreground">
            Type a question…
            <span className="ml-auto grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><ArrowUpRight className="size-4" /></span>
          </div>
        </Link>
      </motion.section>

      <DayInspector date={sel} onClose={() => setSel(null)} />
    </Page>
  );
}
