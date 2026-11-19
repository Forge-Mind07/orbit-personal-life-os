import { useMemo, useState } from "react";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronRight, Link2, TrendingDown, TrendingUp } from "lucide-react";
import { HOLDINGS, holdingInvested, holdingValue, portfolioSummary, sectorAllocation, valueSeries, type Holding, type Period } from "@/lib/orbit/finance";
import { useOrbit } from "@/lib/orbit/store";
import { formatCompactINR, formatINR, formatINR2, formatPct } from "@/lib/orbit/format";
import { ChartTooltip, DemoTag, SectionHeader, Stat } from "../common/bits";
import { Sparkline } from "../common/Sparkline";
import { BottomSheet } from "../common/BottomSheet";
import { cn } from "@/lib/utils";

const PERIODS: Period[] = ["1M", "3M", "6M", "1Y", "ALL"];
const axis = { fill: "var(--muted-foreground)", fontSize: 11 };

export function InvestmentsTab() {
  const { today } = useOrbit();
  const [period, setPeriod] = useState<Period>("6M");
  const [sel, setSel] = useState<Holding | null>(null);
  const [broker, setBroker] = useState(false);
  const p = portfolioSummary();
  const series = useMemo(() => valueSeries("portfolio", p.value, period, today), [p.value, period, today]);
  const change = series[series.length - 1]!.value - series[0]!.value;
  const changePct = (change / series[0]!.value) * 100;
  const alloc = sectorAllocation();
  const up = change >= 0;

  return (
    <div className="space-y-6">
      <section className="card-orbit relative overflow-hidden p-6">
        <span className="absolute -left-16 -top-20 size-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Portfolio value</p>
          <DemoTag>Sample holdings</DemoTag>
        </div>
        <p className="relative mt-1 font-display text-5xl font-bold tracking-tight tnum">{formatINR(p.value)}</p>
        <p className={cn("relative mt-1 inline-flex items-center gap-1 text-sm font-semibold", up ? "text-health" : "text-destructive")}>
          {up ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />} {formatINR(change)} ({formatPct(changePct)}) · {period}
        </p>
        <div className="relative -mx-2 mt-4 h-48" role="img" aria-label={`Portfolio value over ${period}, from ${formatINR(series[0]!.value)} to ${formatINR(p.value)}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} minTickGap={40} />
              <YAxis hide domain={["dataMin - 2000", "dataMax + 2000"]} />
              <Tooltip content={<ChartTooltip format={formatINR} />} />
              <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2.5} fill="url(#pf)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="relative mt-3 flex gap-1.5" role="group" aria-label="Chart period">
          {PERIODS.map((x) => (
            <button key={x} onClick={() => setPeriod(x)} aria-pressed={period === x} className={cn("min-h-10 flex-1 rounded-xl text-xs font-bold", period === x ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground")}>{x}</button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Invested" value={formatINR(p.invested)} />
        <Stat label="Unrealised P&L" value={formatINR(p.pnl)} sub={formatPct(p.pnlPct)} tone={p.pnl >= 0 ? "var(--health)" : "var(--destructive)"} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card-orbit p-5">
          <SectionHeader title="Allocation" eyebrow="By sector" />
          <div className="flex items-center gap-4">
            <div className="size-36 shrink-0" role="img" aria-label={`Sector allocation: ${alloc.map((a) => `${a.sector} ${a.pct.toFixed(0)}%`).join(", ")}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={alloc} dataKey="value" nameKey="sector" innerRadius="66%" outerRadius="100%" paddingAngle={2} stroke="none">
                    {alloc.map((a) => <Cell key={a.sector} fill={a.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="min-w-0 flex-1 space-y-2 text-sm">
              {alloc.map((a) => (
                <li key={a.sector} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: a.color }} />
                  <span className="truncate text-muted-foreground">{a.sector}</span>
                  <span className="ml-auto font-semibold tnum">{a.pct.toFixed(0)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="card-orbit flex flex-col justify-between p-5">
          <div>
            <SectionHeader title="Connect a broker" eyebrow="Not connected" />
            <p className="px-1 text-sm text-muted-foreground">Holdings shown are sample data. Broker sync isn't available in this prototype.</p>
          </div>
          <button onClick={() => setBroker(true)} className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border bg-surface-2 text-sm font-semibold"><Link2 className="size-4" /> Connect broker</button>
        </section>
      </div>

      <section>
        <SectionHeader title="Holdings" eyebrow={`${HOLDINGS.length} demo positions`} />
        <div className="card-orbit divide-y overflow-hidden">
          {HOLDINGS.map((h) => {
            const pnl = holdingValue(h) - holdingInvested(h);
            const s = valueSeries(h.symbol, h.ltp, "1M", today).map((x) => x.value);
            return (
              <button key={h.symbol} onClick={() => setSel(h)} className="flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-surface-2/40">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-2 font-display text-xs font-bold">{h.symbol.slice(0, 2)}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{h.symbol}</p>
                  <p className="truncate text-xs text-muted-foreground">{h.qty} sh · {h.sector}</p>
                </div>
                <div className="hidden w-16 sm:block"><Sparkline id={h.symbol} data={s} color={pnl >= 0 ? "var(--health)" : "var(--destructive)"} height={28} /></div>
                <div className="text-right">
                  <p className="font-display font-semibold tnum">{formatINR(holdingValue(h))}</p>
                  <p className={cn("text-xs font-semibold tnum", pnl >= 0 ? "text-health" : "text-destructive")}>{formatPct((pnl / holdingInvested(h)) * 100)}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </section>

      <BottomSheet open={!!sel} onOpenChange={(o) => !o && setSel(null)} title={sel?.name ?? ""} description={sel ? `${sel.symbol} · NSE · sample data, not live prices` : undefined}>
        {sel && <HoldingDetail h={sel} />}
      </BottomSheet>
      <BrokerSheet open={broker} onOpenChange={setBroker} />
    </div>
  );
}

function HoldingDetail({ h }: { h: Holding }) {
  const { today } = useOrbit();
  const series = valueSeries(h.symbol, h.ltp, "3M", today);
  const value = holdingValue(h);
  const inv = holdingInvested(h);
  const pnl = value - inv;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-display text-4xl font-bold tnum">{formatINR2(h.ltp)}</p>
        <DemoTag />
      </div>
      <p className="text-sm text-muted-foreground">Last sample price</p>
      <div className="mt-4"><Sparkline id={`d-${h.symbol}`} data={series.map((s) => s.value)} color={pnl >= 0 ? "var(--health)" : "var(--destructive)"} height={110} /></div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Quantity" value={h.qty} />
        <Stat label="Avg price" value={formatINR2(h.avgPrice)} />
        <Stat label="Invested" value={formatINR(inv)} />
        <Stat label="Current value" value={formatINR(value)} />
        <div className="col-span-2"><Stat label="Unrealised P&L" value={`${formatINR(pnl)} (${formatPct((pnl / inv) * 100)})`} tone={pnl >= 0 ? "var(--health)" : "var(--destructive)"} /></div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Values compute from quantity × price. Chart uses deterministic sample snapshots.</p>
    </div>
  );
}

function BrokerSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const opts = [
    { name: "ICICI Direct", desc: "Brokerage account sync", status: "Coming later" },
    { name: "Zerodha", desc: "Kite holdings import", status: "Coming later" },
    { name: "Manual", desc: "Enter holdings yourself", status: "Coming later" },
  ];
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Connect a broker" description="Choose a provider. None are wired up in this prototype, so no login is requested.">
      <ul className="space-y-2">
        {opts.map((o) => (
          <li key={o.name} className="flex items-center gap-3 rounded-2xl border p-4">
            <span className="grid size-11 place-items-center rounded-xl bg-surface-2 font-display text-sm font-bold">{o.name[0]}</span>
            <div className="flex-1">
              <p className="font-semibold">{o.name}</p>
              <p className="text-xs text-muted-foreground">{o.desc} · Not connected</p>
            </div>
            <span className="rounded-full bg-surface-2 px-3 py-1 text-[11px] font-semibold text-muted-foreground">{o.status}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">When integrations ship, Orbit will ask for consent through the provider's own sign-in. No credentials are ever typed into Orbit.</p>
    </BottomSheet>
  );
}
