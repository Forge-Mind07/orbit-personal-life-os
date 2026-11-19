import { Button } from "@/components/ui/button";
import { useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronLeft, ChevronRight, Flame, Trophy } from "lucide-react";
import { TODAY_SAMPLE, dayStatus, monthDates, seedDay, streaks, summarize, weekDates, yearByMonth } from "@/lib/orbit/activity";
import { addDays, addMonths, fmt, weekdayIndex, type ISODate } from "@/lib/orbit/dates";
import { formatNum } from "@/lib/orbit/format";
import { useOrbit } from "@/lib/orbit/store";
import { ChartTooltip, Stat } from "../common/bits";
import { STATUS_COLOR, STATUS_LABEL } from "./statusStyle";
import { cn } from "@/lib/utils";

const axis = { fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-sans)" };
const kfmt = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k` : `${v}`);

function Pager({ label, onPrev, onNext, canNext }: { label: string; onPrev: () => void; onNext: () => void; canNext: boolean }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Button variant="ghost" onClick={onPrev} className="grid size-10 place-items-center rounded-full bg-surface-2" aria-label="Previous"><ChevronLeft className="size-4" /></Button>
      <p className="text-sm font-semibold" aria-live="polite">{label}</p>
      <Button variant="ghost" onClick={onNext} disabled={!canNext} className="grid size-10 place-items-center rounded-full bg-surface-2 disabled:opacity-30" aria-label="Next"><ChevronRight className="size-4" /></Button>
    </div>
  );
}

export function DayView() {
  const reduce = useReducedMotion();
  const data = TODAY_SAMPLE.hourly.map((v, h) => ({ h, label: h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`, v })).slice(5, 22);
  const peak = data.reduce((a, b) => (b.v > a.v ? b : a));
  const kindColor = { brisk: "var(--health)", jog: "var(--primary)", everyday: "var(--feed)" } as const;
  return (
    <div className="space-y-5">
      <div className="card-orbit p-5">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold">Steps by hour</p>
          <p className="text-xs text-muted-foreground">Peak {peak.label} · {formatNum(peak.v)}</p>
        </div>
        <div className="mt-4 h-44" role="img" aria-label={`Hourly steps for today. Peak at ${peak.label} with ${peak.v} steps.`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
              <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={kfmt} width={44} />
              <Tooltip cursor={{ fill: "var(--track)" }} content={<ChartTooltip format={(v) => `${formatNum(v)} steps`} />} />
              <Bar isAnimationActive={!reduce} dataKey="v" radius={[6, 6, 6, 6]} maxBarSize={14}>
                {data.map((d) => <Cell key={d.h} fill={d.v === peak.v ? "var(--health)" : "color-mix(in oklab, var(--health) 45%, transparent)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card-orbit p-5">
        <p className="text-sm font-semibold">Activity timeline</p>
        <ol className="mt-4 space-y-0">
          {TODAY_SAMPLE.timeline.map((t, i) => (
            <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
              {i < TODAY_SAMPLE.timeline.length - 1 && <span className="absolute left-[7px] top-5 h-full w-px bg-border" />}
              <span className="relative mt-1 size-[15px] shrink-0 rounded-full border-[3px] border-card" style={{ background: kindColor[t.kind] }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-xs text-muted-foreground tnum">{t.time}</p>
                </div>
                <p className="text-sm text-muted-foreground">{formatNum(t.steps)} steps · {t.minutes} min · {t.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function WeekView({ onSelect }: { onSelect: (d: ISODate) => void }) {
  const { state, today } = useOrbit();
  const reduce = useReducedMotion();
  const goal = state.stepGoal;
  const [offset, setOffset] = useState(0);
  const anchor = addDays(today, offset * 7);
  const s = useMemo(() => summarize(weekDates(anchor), goal, today), [anchor, goal, today]);
  const data = s.days.map((d) => ({ date: d.date, label: fmt(d.date, "EEE"), v: d.steps ?? 0, status: dayStatus(d, goal, today) }));
  const range = `${fmt((s.days[0]?.date ?? anchor), "d MMM")} – ${fmt((s.days[6]?.date ?? anchor), "d MMM")}`;
  return (
    <div className="space-y-5">
      <div className="card-orbit p-5">
        <Pager label={offset === 0 ? "This week" : range} onPrev={() => setOffset((o) => o - 1)} onNext={() => setOffset((o) => Math.min(0, o + 1))} canNext={offset < 0} />
        <div className="h-52" role="img" aria-label={`Weekly steps ${range}. Goal met on ${s.completed} days, average ${s.avgSteps} steps.`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 12, right: 4, left: -24, bottom: 0 }}>
              <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} />
              <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={kfmt} width={44} domain={[0, (max: number) => Math.max(max, goal) * 1.1]} />
              <Tooltip cursor={{ fill: "var(--track)", radius: 10 }} content={<ChartTooltip format={(v) => `${formatNum(v)} steps`} />} />
              <ReferenceLine y={goal} stroke="var(--muted-foreground)" strokeDasharray="4 4" label={{ value: "Goal", position: "insideTopRight", fill: "var(--muted-foreground)", fontSize: 11 }} />
              <Bar isAnimationActive={!reduce} dataKey="v" radius={[10, 10, 10, 10]} maxBarSize={34} onClick={(d: { date?: string }) => d.date && onSelect(d.date)} className="cursor-pointer">
                {data.map((d) => <Cell key={d.date} fill={d.status === "future" || d.status === "nodata" ? "var(--track)" : STATUS_COLOR[d.status]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {data.map((d) => (
            <Button variant="ghost" key={d.date} onClick={() => onSelect(d.date)} className="flex min-h-11 flex-col items-center justify-center rounded-xl text-[11px] text-muted-foreground hover:bg-surface-2" aria-label={`${fmt(d.date, "EEEE d MMM")}: ${STATUS_LABEL[d.status]}`}>
              <span className="size-2 rounded-full" style={{ background: STATUS_COLOR[d.status] }} />
              <span className="mt-1">{fmt(d.date, "d")}</span>
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Goal days" value={`${s.completed} / ${s.completed + s.missed}`} sub={s.rest ? `${s.rest} planned rest` : "eligible days"} tone="var(--health)" />
        <Stat label="Avg steps" value={formatNum(s.avgSteps)} sub="per day with data" />
        <Stat label="Distance" value={`${s.totalKm} km`} sub="this week" />
        <Stat label="Best day" value={s.best ? formatNum(s.best.steps ?? 0) : "—"} sub={s.best ? fmt(s.best.date, "EEEE") : ""} />
      </div>
    </div>
  );
}

export function MonthView({ onSelect }: { onSelect: (d: ISODate) => void }) {
  const { state, today } = useOrbit();
  const reduce = useReducedMotion();
  const goal = state.stepGoal;
  const [offset, setOffset] = useState(0);
  const anchor = addMonths(today, offset);
  const s = useMemo(() => summarize(monthDates(anchor), goal, today), [anchor, goal, today]);
  const lead = weekdayIndex((s.days[0]?.date ?? anchor));
  return (
    <div className="space-y-5">
      <div className="card-orbit p-5">
        <Pager label={fmt(anchor, "MMMM yyyy")} onPrev={() => setOffset((o) => o - 1)} onNext={() => setOffset((o) => Math.min(0, o + 1))} canNext={offset < 0} />
        <div className="health-calendar-weekdays grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-muted-foreground">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5" role="grid" aria-label={`Calendar for ${fmt(anchor, "MMMM")}`}>
          {Array.from({ length: lead }, (_, i) => <span key={`e${i}`} />)}
          {s.days.map((d) => {
            const st = dayStatus(d, goal, today);
            const refl = state.reflections[d.date];
            const progress = st === "today" ? Math.min(1, (d.steps ?? 0) / goal) : 0;
            return (
              <Button variant="ghost"
                key={d.date}
                data-status={st}
                onClick={() => onSelect(d.date)}
                aria-label={`${fmt(d.date, "d MMMM")}: ${STATUS_LABEL[st]}${d.steps !== null ? `, ${d.steps} steps` : ""}${refl ? `, reflection ${refl.reason}` : ""}`}
                className={cn(
                  "relative grid aspect-square min-h-10 place-items-center overflow-hidden rounded-xl text-xs font-semibold tnum transition-transform active:scale-95",
                  st === "completed" && "bg-health text-on-accent",
                  st === "missed" && "bg-finance/15 text-finance ring-1 ring-inset ring-finance/50",
                  st === "rest" && "bg-[repeating-linear-gradient(135deg,var(--rest)_0_3px,transparent_3px_7px)] text-foreground ring-1 ring-inset ring-[var(--rest)]",
                  st === "nodata" && "border border-dashed border-muted-foreground/40 text-muted-foreground",
                  st === "today" && "bg-surface-2 text-foreground ring-2 ring-inset ring-primary",
                  st === "future" && "bg-surface-2/40 text-muted-foreground/60",
                )}
              >
                {st === "today" && <span className="absolute inset-x-0 bottom-0 bg-primary/35" style={{ height: `${progress * 100}%` }} />}
                <span className="relative">{fmt(d.date, "d")}</span>
                {refl && <span className="absolute right-1 top-1 size-1.5 rounded-full bg-foreground" />}
              </Button>
            );
          })}
        </div>
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {(["completed", "missed", "rest", "nodata", "today"] as const).map((k) => (
            <li key={k} className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: STATUS_COLOR[k] }} />{STATUS_LABEL[k]}</li>
          ))}
          <li className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-foreground" />Reflection</li>
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Completed" value={s.completed} sub="goal days" tone="var(--health)" />
        <Stat label="Below goal" value={s.missed} sub="tap to reflect" tone="var(--finance)" />
        <Stat label="Planned rest" value={s.rest} sub="doesn't break streaks" />
        <Stat label="No data" value={s.nodata} sub="not counted as missed" />
      </div>
    </div>
  );
}

export function YearView() {
  const { state, today } = useOrbit();
  const reduce = useReducedMotion();
  const data = useMemo(() => yearByMonth(state.stepGoal, today), [state.stepGoal, today]);
  const st = useMemo(() => streaks(state.stepGoal, today), [state.stepGoal, today]);
  const completed = data.reduce((t, m) => t + m.completed, 0);
  const eligible = data.reduce((t, m) => t + m.completed + m.missed, 0);
  const km = data.reduce((t, m) => t + m.totalKm, 0);
  const rate = eligible ? Math.round((completed / eligible) * 100) : 0;
  return (
    <div className="space-y-5">
      <div className="card-orbit p-5">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold">Monthly completion</p>
          <p className="text-xs text-muted-foreground">Last 12 months</p>
        </div>
        <div className="mt-4 h-48" role="img" aria-label={`Goal completion rate by month. Overall ${rate}% over the last 12 months.`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={40} domain={[0, 100]} />
              <Tooltip cursor={{ fill: "var(--track)", radius: 8 }} content={<ChartTooltip format={(v) => `${v}% of eligible days`} />} />
              <Bar isAnimationActive={!reduce} dataKey="completionRate" radius={[8, 8, 8, 8]} maxBarSize={20}>
                {data.map((d, i) => <Cell key={d.month} fill={i === data.length - 1 ? "var(--primary)" : "var(--health)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex items-center gap-4 rounded-2xl bg-surface-2/60 p-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-finance/15 text-finance"><Flame className="size-6" /></div>
          <div>
            <p className="font-display text-2xl font-bold tnum">{st.current} days</p>
            <p className="text-sm text-muted-foreground">Current streak · longest {st.longest} days</p>
          </div>
          <Trophy className="ml-auto size-5 text-muted-foreground" />
        </div>
        <Stat label="Completion rate" value={`${rate}%`} sub={`${completed} of ${eligible} eligible days`} tone="var(--health)" />
        <Stat label="Distance" value={`${formatNum(km)} km`} sub="last 12 months" />
      </div>
    </div>
  );
}
