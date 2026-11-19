import { addDays, addMonths, daysInMonth, fmt, range, startOfMonth, startOfWeek, weekdayIndex, type ISODate } from "./dates";

export type DayStatus = "completed" | "missed" | "rest" | "nodata" | "today" | "future";

export interface ActivityBreakdown {
  /** Incidental steps: chores, commuting, errands. Not a workout. */
  everyday: number;
  brisk: number;
  jog: number;
  run: number;
}

export interface DayActivity {
  date: ISODate;
  steps: number | null;
  plannedRest: boolean;
  distanceKm: number;
  activeMin: number;
  breakdown: ActivityBreakdown;
  isSampleToday: boolean;
}

export const KM_PER_STEP = 0.000716;
const EMPTY: ActivityBreakdown = { everyday: 0, brisk: 0, jog: 0, run: 0 };

/** Deterministic 0..1 hash so the same date always yields the same demo data. */
export function hash01(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

export function activeMinutes(b: ActivityBreakdown): number {
  return Math.round(b.everyday / 180 + b.brisk / 105 + b.jog / 155 + b.run / 175);
}

/** Separate fixed sample used for "today" regardless of the real calendar date. */
export const TODAY_SAMPLE = {
  steps: 7420,
  breakdown: { everyday: 4180, brisk: 2140, jog: 1100, run: 0 } as ActivityBreakdown,
  hourly: [0, 0, 0, 0, 0, 0, 520, 1380, 640, 230, 180, 240, 310, 890, 220, 160, 240, 380, 1210, 520, 300, 0, 0, 0],
  timeline: [
    { time: "06:45", title: "Morning brisk walk", kind: "brisk" as const, steps: 1380, minutes: 13, note: "Besant Nagar promenade loop" },
    { time: "08:30", title: "Commute & errands", kind: "everyday" as const, steps: 870, minutes: 5, note: "Counted as everyday movement" },
    { time: "13:05", title: "Post-lunch walk", kind: "brisk" as const, steps: 760, minutes: 7, note: "Short loop around the office" },
    { time: "18:20", title: "Easy jog", kind: "jog" as const, steps: 1100, minutes: 7, note: "Relaxed pace, conversational effort" },
    { time: "All day", title: "Everyday movement", kind: "everyday" as const, steps: 3310, minutes: 18, note: "Chores, stairs and standing breaks" },
  ],
};

export function isPlannedRest(date: ISODate): boolean {
  return weekdayIndex(date) === 6 && hash01(`${date}:rest`) < 0.55;
}

export function seedDay(date: ISODate, today: ISODate): DayActivity {
  const plannedRest = isPlannedRest(date);
  if (date === today) {
    const b = TODAY_SAMPLE.breakdown;
    return {
      date,
      steps: TODAY_SAMPLE.steps,
      plannedRest: false,
      distanceKm: +(TODAY_SAMPLE.steps * KM_PER_STEP).toFixed(1),
      activeMin: activeMinutes(b),
      breakdown: b,
      isSampleToday: true,
    };
  }
  if (date > today || hash01(`${date}:data`) < 0.04) {
    return { date, steps: null, plannedRest, distanceKm: 0, activeMin: 0, breakdown: EMPTY, isSampleToday: false };
  }
  const h = hash01(`${date}:steps`);
  const weekend = weekdayIndex(date) >= 5 ? 600 : 0;
  const raw = plannedRest ? 2600 + h * 2400 : 5400 + Math.pow(h, 0.75) * 7600 + weekend;
  const steps = Math.round(raw / 10) * 10;
  const t = hash01(`${date}:type`);
  const brisk = Math.round(steps * (0.14 + t * 0.14));
  const jog = !plannedRest && t > 0.55 ? Math.round(steps * 0.13) : 0;
  const run = !plannedRest && t > 0.82 ? Math.round(steps * 0.11) : 0;
  const breakdown = { everyday: steps - brisk - jog - run, brisk, jog, run };
  return {
    date,
    steps,
    plannedRest,
    distanceKm: +(steps * KM_PER_STEP).toFixed(1),
    activeMin: activeMinutes(breakdown),
    breakdown,
    isSampleToday: false,
  };
}

export function dayStatus(day: DayActivity, goal: number, today: ISODate): DayStatus {
  if (day.date > today) return "future";
  if (day.date === today) return "today";
  if (day.steps === null) return "nodata";
  if (day.steps >= goal) return "completed";
  if (day.plannedRest) return "rest";
  return "missed";
}

/** A past day below goal that wasn't a planned rest and has data. Today never prompts. */
export function canReflect(status: DayStatus): boolean {
  return status === "missed";
}

export interface RangeSummary {
  days: DayActivity[];
  completed: number;
  missed: number;
  rest: number;
  nodata: number;
  avgSteps: number;
  totalSteps: number;
  totalKm: number;
  best: DayActivity | null;
}

export function summarize(dates: ISODate[], goal: number, today: ISODate): RangeSummary {
  const days = dates.map((d) => seedDay(d, today));
  let completed = 0, missed = 0, rest = 0, nodata = 0, total = 0, counted = 0, km = 0;
  let best: DayActivity | null = null;
  for (const d of days) {
    const s = dayStatus(d, goal, today);
    if (s === "completed") completed++;
    else if (s === "missed") missed++;
    else if (s === "rest") rest++;
    else if (s === "nodata") nodata++;
    if (d.steps !== null) {
      total += d.steps;
      counted++;
      km += d.distanceKm;
      if (!best || d.steps > (best.steps ?? 0)) best = d;
    }
  }
  return {
    days,
    completed,
    missed,
    rest,
    nodata,
    avgSteps: counted ? Math.round(total / counted) : 0,
    totalSteps: total,
    totalKm: +km.toFixed(1),
    best,
  };
}

export const weekDates = (anyDay: ISODate) => range(startOfWeek(anyDay), 7);
export const monthDates = (anyDay: ISODate) => range(startOfMonth(anyDay), daysInMonth(anyDay));

/** Streaks: planned rest and missing-data days neither count nor break a streak. */
export function streaks(goal: number, today: ISODate) {
  let current = 0;
  let cursor = today;
  const todayDay = seedDay(today, today);
  if ((todayDay.steps ?? 0) >= goal) current++;
  cursor = addDays(today, -1);
  for (let i = 0; i < 400; i++) {
    const s = dayStatus(seedDay(cursor, today), goal, today);
    if (s === "missed") break;
    if (s === "completed") current++;
    cursor = addDays(cursor, -1);
  }
  let longest = 0, run = 0;
  for (const d of range(addDays(today, -364), 365)) {
    const s = dayStatus(seedDay(d, today), goal, today);
    if (s === "completed") { run++; longest = Math.max(longest, run); }
    else if (s === "missed") run = 0;
  }
  return { current, longest: Math.max(longest, current) };
}

export function yearByMonth(goal: number, today: ISODate) {
  return Array.from({ length: 12 }, (_, i) => {
    const m = addMonths(today, i - 11);
    const s = summarize(monthDates(m), goal, today);
    const eligible = s.completed + s.missed;
    return {
      month: m,
      label: fmt(m, "MMM"),
      avgSteps: s.avgSteps,
      completionRate: eligible ? Math.round((s.completed / eligible) * 100) : 0,
      completed: s.completed,
      missed: s.missed,
      rest: s.rest,
      totalKm: s.totalKm,
    };
  });
}

export interface Insight {
  id: string;
  title: string;
  body: string;
  metric: string;
  tone: "health" | "violet" | "feed" | "finance";
}

/** Insights derived from the same seeded data the charts use. */
export function computeInsights(goal: number, today: ISODate): Insight[] {
  const out: Insight[] = [];
  const thisWeek = weekDates(today).filter((d) => d <= today);
  const lastWeek = thisWeek.map((d) => addDays(d, -7));
  const a = summarize(thisWeek, goal, today);
  const b = summarize(lastWeek, goal, today);
  if (b.avgSteps > 0) {
    const pct = Math.round(((a.avgSteps - b.avgSteps) / b.avgSteps) * 100);
    out.push({
      id: "wow",
      title: pct >= 0 ? "Building gently on last week" : "A softer week so far",
      body:
        pct >= 0
          ? `You're averaging ${a.avgSteps.toLocaleString("en-IN")} steps a day, ${pct}% above the same days last week.`
          : `You're averaging ${a.avgSteps.toLocaleString("en-IN")} steps a day. Lighter weeks are part of a sustainable rhythm.`,
      metric: `${pct >= 0 ? "+" : ""}${pct}%`,
      tone: "health",
    });
  }
  const byWd = Array.from({ length: 7 }, () => ({ t: 0, n: 0 }));
  for (const d of range(addDays(today, -56), 56)) {
    const day = seedDay(d, today);
    if (day.steps !== null) { byWd[weekdayIndex(d)].t += day.steps; byWd[weekdayIndex(d)].n++; }
  }
  const names = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"];
  const avgs = byWd.map((x) => (x.n ? x.t / x.n : 0));
  const bestWd = avgs.indexOf(Math.max(...avgs));
  out.push({
    id: "weekday",
    title: `${names[bestWd]} are your strongest`,
    body: `Over the last 8 weeks you average ${Math.round(avgs[bestWd]).toLocaleString("en-IN")} steps on ${names[bestWd]}. Worth protecting that routine.`,
    metric: names[bestWd].slice(0, 3),
    tone: "violet",
  });
  const m = summarize(monthDates(today).filter((d) => d < today), goal, today);
  out.push({
    id: "rest",
    title: m.rest > 0 ? "Recovery is on the plan" : "Room for a rest day",
    body:
      m.rest > 0
        ? `You took ${m.rest} planned rest day${m.rest > 1 ? "s" : ""} this month. Rest days don't break your streak.`
        : "No planned rest days logged this month yet. A lighter day can make the next one easier.",
    metric: `${m.rest} rest`,
    tone: "feed",
  });
  const st = streaks(goal, today);
  out.push({
    id: "streak",
    title: st.current > 0 ? `${st.current}-day goal streak` : "Fresh start ready",
    body:
      st.current > 0
        ? `Your longest this year is ${st.longest} days. No pressure, just momentum.`
        : `Your longest streak this year is ${st.longest} days. Any day is a good day to begin again.`,
    metric: `${st.current}d`,
    tone: "finance",
  });
  return out;
}
