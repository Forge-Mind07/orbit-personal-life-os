import { createFileRoute, Link } from "@tanstack/react-router";
import { BellOff, Footprints, Newspaper, Wallet } from "lucide-react";
import { useOrbit } from "@/lib/orbit/store";
import { inMonth, sumAmounts } from "@/lib/orbit/finance";
import { formatINR, formatNum } from "@/lib/orbit/format";
import { Page } from "@/components/orbit/common/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · ORBIT" },
      { name: "description", content: "Gentle nudges about your activity, budget and briefing." },
      { property: "og:title", content: "Notifications · ORBIT" },
      { property: "og:description", content: "Gentle nudges about your activity, budget and briefing." },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  const { state, update, allExpenses, today } = useOrbit();
  const spent = sumAmounts(allExpenses.filter((e) => inMonth(e, today)));
  const items = [
    { id: "steps", to: "/health" as const, icon: Footprints, tone: "var(--health)", title: "An evening walk would close your ring", body: `${formatNum(Math.max(0, state.stepGoal - 7420))} steps to go today.`, time: "Sample · now" },
    { id: "budget", to: "/finance" as const, icon: Wallet, tone: "var(--finance)", title: `${Math.round((spent / state.budget) * 100)}% of monthly budget used`, body: `${formatINR(spent)} of ${formatINR(state.budget)} so far.`, time: "Sample · 2h" },
    { id: "brief", to: "/feed" as const, icon: Newspaper, tone: "var(--feed)", title: "Your daily briefing is ready", body: "Three illustrative stories picked for your topics.", time: "Sample · 6h" },
  ];
  const read = state.readNotifications;
  return (
    <Page className="max-w-3xl space-y-4 pt-6">
      <div className="flex justify-end">
        <button onClick={() => update((s) => ({ ...s, readNotifications: items.map((i) => i.id) }))} disabled={read.length === items.length} className="min-h-10 rounded-full px-3 text-sm font-semibold text-primary disabled:text-muted-foreground">Mark all read</button>
      </div>
      {items.length === 0 ? (
        <div className="card-orbit p-10 text-center"><BellOff className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 font-semibold">You're all caught up</p></div>
      ) : (
        <ul className="card-orbit divide-y overflow-hidden">
          {items.map((n) => {
            const unread = !read.includes(n.id);
            return (
              <li key={n.id}>
                <Link to={n.to} onClick={() => update((s) => ({ ...s, readNotifications: [...new Set([...s.readNotifications, n.id])] }))} className={cn("flex gap-4 px-5 py-4 hover:bg-surface-2/40", unread && "bg-accent/30")}>
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-2"><n.icon className="size-5" style={{ color: n.tone }} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                  </div>
                  {unread && <span className="mt-2 size-2.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Page>
  );
}
