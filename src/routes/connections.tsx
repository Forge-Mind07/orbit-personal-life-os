import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeartPulse, Info, Landmark, Laptop, MessageSquareText, Newspaper, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useOrbit } from "@/lib/orbit/store";
import { Page, PrimaryButton, SectionHeader } from "@/components/orbit/common/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/connections")({
  head: () => ({
    meta: [
      { title: "Connections · ORBIT" },
      { name: "description", content: "Device and service connections. Nothing is connected in this demo." },
      { property: "og:title", content: "Connections · ORBIT" },
      { property: "og:description", content: "Device and service connections for Orbit." },
    ],
  }),
  component: Connections,
});

const INTEGRATIONS = [
  { name: "Health Connect / Google Fit", desc: "Steps and workouts", icon: HeartPulse, tone: "var(--health)" },
  { name: "Zerodha", desc: "Holdings import", icon: TrendingUp, tone: "var(--primary)" },
  { name: "ICICI Direct", desc: "Holdings import", icon: Landmark, tone: "var(--finance)" },
  { name: "Bank SMS parsing", desc: "Automatic expense capture", icon: MessageSquareText, tone: "var(--finance)" },
  { name: "News sources", desc: "Licensed publisher feeds", icon: Newspaper, tone: "var(--feed)" },
];

const MODES = [
  { id: "lan", label: "Local network" },
  { id: "tailscale", label: "Tailscale" },
  { id: "custom", label: "Custom" },
] as const;

function Connections() {
  const { state, update } = useOrbit();
  const [mode, setMode] = useState(state.laptop.mode);
  const [endpoint, setEndpoint] = useState(state.laptop.endpoint);
  return (
    <Page className="max-w-3xl space-y-7 pt-6">
      <section className="card-orbit p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-surface-2"><Laptop className="size-7 text-muted-foreground" /></span>
          <div>
            <p className="font-display text-xl font-semibold">Laptop agent</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><span className="size-2 rounded-full bg-muted-foreground" /> Offline — not connected</p>
          </div>
        </div>
        <fieldset className="mt-6">
          <legend className="text-sm font-semibold">Endpoint preference</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {MODES.map((m) => (
              <button key={m.id} type="button" aria-pressed={mode === m.id} onClick={() => setMode(m.id)} className={cn("min-h-11 rounded-xl text-sm font-semibold", mode === m.id ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground")}>{m.label}</button>
            ))}
          </div>
        </fieldset>
        <label className="mt-4 block">
          <span className="text-sm font-semibold">Address</span>
          <input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="mt-2 h-12 w-full rounded-2xl border bg-surface-2/50 px-4 font-mono text-sm outline-none focus:border-primary" spellCheck={false} />
        </label>
        <PrimaryButton className="mt-4 w-full" onClick={() => { update((s) => ({ ...s, laptop: { mode, endpoint: endpoint.trim() } })); toast.success("Preference saved", { description: "Stored on this device only. Orbit won't contact this address yet." }); }}>Save preference</PrimaryButton>
        <div className="mt-5 flex gap-3 rounded-2xl bg-surface-2/60 p-4 text-sm text-muted-foreground">
          <Info className="size-5 shrink-0" />
          <p>Full laptop-agent wiring comes later. A future companion app on your laptop will pair with Orbit and ask permission before any file or task access. This prototype never calls the address above and has no filesystem access.</p>
        </div>
      </section>
      <section>
        <SectionHeader title="Integrations" eyebrow="Availability" />
        <ul className="card-orbit divide-y">
          {INTEGRATIONS.map((i) => (
            <li key={i.name} className="flex items-center gap-3 px-5 py-4">
              <span className="grid size-11 place-items-center rounded-2xl bg-surface-2"><i.icon className="size-5" style={{ color: i.tone }} /></span>
              <div className="min-w-0 flex-1"><p className="truncate font-semibold">{i.name}</p><p className="text-xs text-muted-foreground">{i.desc} · Not connected</p></div>
              <span className="shrink-0 rounded-full bg-surface-2 px-3 py-1 text-[11px] font-semibold text-muted-foreground">Coming later</span>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
