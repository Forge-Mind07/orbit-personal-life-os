import { motion, useReducedMotion } from "motion/react";
import { Footprints, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "../common/CountUp";
import { seedDay } from "@/lib/orbit/activity";
import { addDays, fmt, type ISODate } from "@/lib/orbit/dates";
import { formatNum } from "@/lib/orbit/format";

export function DateStrip({ dates, selected, onSelect, id }: { dates: ISODate[]; selected: ISODate; onSelect: (date: ISODate) => void; id: string }) {
  const reduce = useReducedMotion();
  return <div className="health-date-strip" aria-label="Select activity date">
    {dates.map((date) => <div key={date} className="health-date-item">
      <span>{fmt(date, "EEE")}</span>
      <Button variant="ghost" aria-pressed={selected === date} aria-label={fmt(date, "EEEE, d MMMM")} onClick={() => onSelect(date)} className="health-date-button">
        {selected === date && <motion.span layoutId={`health-date-${id}`} className="health-selected-date" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 30 }} />}
        <span className="relative">{fmt(date, "d")}</span>
      </Button>
    </div>)}
  </div>;
}

export function StepTracker({ today, selected, goal, dates, onSelect, onEdit }: { today: ISODate; selected: ISODate; goal: number; dates: ISODate[]; onSelect: (date: ISODate) => void; onEdit: () => void }) {
  const reduce = useReducedMotion();
  const day = seedDay(selected, today);
  const max = Math.max(goal, ...dates.map((d) => seedDay(d, today).steps ?? 0));
  return <section className="health-tracker" aria-label="Step tracker">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3"><span className="health-icon"><Footprints /></span><h2>Step Tracker</h2></div>
      <Button variant="ghost" size="icon" className="health-icon" onClick={onEdit} aria-label="Edit daily step target" title="Edit daily step target"><Pencil /></Button>
    </div>
    <div className="health-tracker-total" aria-live="polite"><strong>{day.steps === null ? "—" : <CountUp value={day.steps} duration={650} />}</strong><span>steps / {formatNum(goal)} target</span></div>
    <div className="health-pill-chart" aria-label="Last seven days of demo steps">
      {dates.map((date, i) => {
        const d = seedDay(date, today);
        const active = date === selected;
        return <Button key={date} variant="ghost" className={`health-bar-button ${active ? "is-selected" : ""}`} onClick={() => onSelect(date)} aria-pressed={active} aria-label={`${fmt(date, "EEEE d MMM")}, ${d.steps === null ? "no data" : `${d.steps} steps`}`}>
          <span className="health-bar-number">{d.steps === null ? "—" : `${((d.steps ?? 0) / 1000).toFixed(1)}k`}</span>
          <span className="health-bar-track">
            <motion.span className="health-bar-fill" initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: (d.steps ?? 0) / max }} transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : i * 0.055, ease: [0.22, 1, 0.36, 1] }} />
            {date === today && <span className="health-bar-stripes" />}
            <Footprints className="health-bar-glyph" />
          </span>
          <span className="health-bar-day">{fmt(date, "EEE").slice(0, 1)}</span>
        </Button>;
      })}
    </div>
    <div className="health-tracker-foot"><span className="health-active-dot" />{selected === today ? "Today · sample in progress" : `${fmt(selected, "d MMM")} · synthetic history`}<span className="ml-auto">7 days</span></div>
  </section>;
}

export const recentDates = (today: ISODate) => Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));