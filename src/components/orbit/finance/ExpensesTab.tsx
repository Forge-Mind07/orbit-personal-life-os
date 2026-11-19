import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Mic, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useOrbit } from "@/lib/orbit/store";
import { categoryColor, categoryTotals, inMonth, monthlyTrend, sumAmounts, type Category } from "@/lib/orbit/finance";
import { daysInMonth, fmt, fromISO, relativeDayLabel } from "@/lib/orbit/dates";
import { formatCompactINR, formatINR } from "@/lib/orbit/format";
import { ChartTooltip, Chip, DemoTag, SectionHeader } from "../common/bits";
import { CATEGORY_ICON } from "./icons";
import { AddExpenseSheet, type ExpenseDraft } from "./AddExpenseSheet";
import { VoiceCapture } from "./VoiceCapture";

const axis = { fill: "var(--muted-foreground)", fontSize: 11 };

export function ExpensesTab() {
  const { state, today, allExpenses, removeExpense } = useOrbit();
  const [filter, setFilter] = useState<Category | "All">("All");
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<ExpenseDraft> | undefined>();
  const [voice, setVoice] = useState(false);

  const month = useMemo(() => allExpenses.filter((e) => inMonth(e, today)), [allExpenses, today]);
  const spent = sumAmounts(month);
  const remaining = state.budget - spent;
  const pct = Math.min(100, (spent / state.budget) * 100);
  const daysLeft = daysInMonth(today) - fromISO(today).getDate() + 1;
  const trend = useMemo(() => monthlyTrend(allExpenses, today), [allExpenses, today]);
  const cats = useMemo(() => categoryTotals(month), [month]);
  const list = filter === "All" ? month : month.filter((e) => e.category === filter);
  const over = remaining < 0;

  const groups = useMemo(() => {
    const m = new Map<string, typeof list>();
    for (const e of list) m.set(e.date, [...(m.get(e.date) ?? []), e]);
    return [...m.entries()];
  }, [list]);

  return (
    <div className="space-y-6">
      <section className="card-orbit relative overflow-hidden p-6">
        <span className="absolute -right-16 -top-16 size-48 rounded-full bg-finance/15 blur-3xl" />
        <p className="text-sm font-medium text-muted-foreground">Spent in {fmt(today, "MMMM")}</p>
        <p className="mt-1 font-display text-5xl font-bold tracking-tight tnum">{formatINR(spent)}<span className="ml-2 text-lg font-medium text-muted-foreground">/ {formatINR(state.budget)}</span></p>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Budget used">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: over ? "var(--destructive)" : "linear-gradient(90deg, var(--finance), color-mix(in oklab, var(--finance) 60%, var(--cat-shopping)))" }} />
        </div>
        <div className="mt-3 flex justify-between text-sm">
          <span className={over ? "font-semibold text-destructive" : "font-semibold"}>{over ? `${formatINR(-remaining)} over` : `${formatINR(remaining)} left`}</span>
          <span className="text-muted-foreground">{Math.round(pct)}% used · {daysLeft} days left{!over ? ` · ~${formatINR(remaining / daysLeft)}/day` : ""}</span>
        </div>
        <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
          <button onClick={() => { setDraft(undefined); setAddOpen(true); }} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-finance text-base font-bold text-on-accent active:scale-[0.98]">
            <Plus className="size-5" /> Add expense
          </button>
          <button onClick={() => setVoice(true)} className="relative grid size-14 place-items-center rounded-2xl border-2 border-finance/60 bg-finance/10 text-finance active:scale-95" aria-label="Voice entry (simulated)">
            <Mic className="size-6" />
            <span className="absolute -right-1.5 -top-1.5 rounded-full bg-surface-2 px-1.5 text-[9px] font-bold uppercase text-muted-foreground">Sim</span>
          </button>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card-orbit p-5">
          <SectionHeader title="Monthly trend" eyebrow="6 months" />
          <div className="h-44" role="img" aria-label={`Monthly spending for the last 6 months: ${trend.map((t) => `${t.label} ${t.total}`).join(", ")}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--finance)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--finance)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--track)" />
                <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={formatCompactINR} width={52} />
                <Tooltip content={<ChartTooltip format={formatINR} />} />
                <ReferenceLine y={state.budget} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="total" stroke="var(--finance)" strokeWidth={2.5} fill="url(#trend)" dot={{ r: 3, fill: "var(--finance)" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Dashed line is your {formatINR(state.budget)} budget. Prior months are sample totals.</p>
        </section>
        <section className="card-orbit p-5">
          <SectionHeader title="By category" eyebrow="This month" />
          <div className="flex items-center gap-4">
            <div className="relative size-36 shrink-0" role="img" aria-label={`Category split: ${cats.map((c) => `${c.category} ${c.total}`).join(", ")}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={cats} dataKey="total" nameKey="category" innerRadius="68%" outerRadius="100%" paddingAngle={2} stroke="none" onClick={(d: { category?: Category }) => d.category && setFilter(d.category)}>
                    {cats.map((c) => <Cell key={c.category} fill={c.color} opacity={filter === "All" || filter === c.category ? 1 : 0.25} className="cursor-pointer" />)}
                  </Pie>
                  <Tooltip content={({ active, payload }) => active && payload?.length ? <ChartTooltip active label={String(payload[0].name)} payload={[{ value: Number(payload[0].value) }]} format={formatINR} /> : null} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div><p className="text-[10px] text-muted-foreground">Total</p><p className="font-display text-sm font-bold tnum">{formatCompactINR(spent)}</p></div>
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-1">
              {cats.map((c) => (
                <li key={c.category}>
                  <button onClick={() => setFilter(filter === c.category ? "All" : c.category)} className="flex min-h-8 w-full items-center gap-2 rounded-lg px-1 text-sm hover:bg-surface-2" aria-pressed={filter === c.category}>
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
                    <span className="truncate text-muted-foreground">{c.category}</span>
                    <span className="ml-auto font-semibold tnum">{formatINR(c.total)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section>
        <SectionHeader title="Transactions" eyebrow={`${list.length} this month`} />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
          <Chip active={filter === "All"} onClick={() => setFilter("All")}>All</Chip>
          {cats.map((c) => <Chip key={c.category} active={filter === c.category} onClick={() => setFilter(c.category)}><span className="size-2 rounded-full" style={{ background: c.color }} />{c.category}</Chip>)}
        </div>
        {groups.length === 0 ? (
          <div className="card-orbit p-8 text-center text-sm text-muted-foreground">No {filter} expenses this month.</div>
        ) : (
          <div className="card-orbit divide-y overflow-hidden">
            {groups.map(([date, items]) => (
              <div key={date}>
                <p className="bg-surface-2/40 px-5 py-2 text-xs font-semibold text-muted-foreground">{relativeDayLabel(date, today)} · {fmt(date, "d MMM")}</p>
                {items.map((e) => {
                  const Icon = CATEGORY_ICON[e.category];
                  return (
                    <div key={e.id} className="flex items-center gap-3 px-5 py-3.5">
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-2"><Icon className="size-5" style={{ color: categoryColor(e.category) }} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{e.merchant ?? e.description}</p>
                        <p className="truncate text-xs text-muted-foreground">{e.merchant ? `${e.description} · ` : ""}{e.category} · {e.payment}{e.source === "voice" ? " · voice" : ""}</p>
                      </div>
                      <p className="font-display font-semibold tnum">{formatINR(e.amount)}</p>
                      {e.source !== "seed" && (
                        <button onClick={() => { removeExpense(e.id); toast("Expense removed"); }} className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-destructive" aria-label={`Delete ${e.description}`}><Trash2 className="size-4" /></button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 flex items-center gap-2 px-1 text-xs text-muted-foreground"><DemoTag /> Sample transactions. Your additions are stored only in this browser.</p>
      </section>

      <AddExpenseSheet open={addOpen} onOpenChange={setAddOpen} initial={draft} />
      <VoiceCapture open={voice} onClose={() => setVoice(false)} onEdit={(d) => { setVoice(false); setDraft(d); setAddOpen(true); }} />
    </div>
  );
}
