import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, Moon, Plug, RotateCcw, Sun } from "lucide-react";
import { toast } from "sonner";
import { useOrbit } from "@/lib/orbit/store";
import { CITIES, TOPICS, type Topic } from "@/lib/orbit/feed";
import { Chip, Page, PrimaryButton, SectionHeader } from "@/components/orbit/common/bits";
import { SegmentTabs } from "@/components/orbit/common/SegmentTabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Settings · ORBIT" },
      { name: "description", content: "Theme, step target, monthly budget, city, topics and demo data controls." },
      { property: "og:title", content: "Settings · ORBIT" },
      { property: "og:description", content: "Theme, step target, monthly budget, city, topics and demo data controls." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { state, update, reset } = useOrbit();
  const [goal, setGoal] = useState(String(state.stepGoal));
  const [budget, setBudget] = useState(String(state.budget));
  const [city, setCity] = useState(state.city);
  const [topics, setTopics] = useState<Topic[]>(state.topics);
  useEffect(() => { setGoal(String(state.stepGoal)); setBudget(String(state.budget)); setCity(state.city); setTopics(state.topics); }, [state.stepGoal, state.budget, state.city, state.topics]);

  const g = Number(goal), b = Number(budget);
  const goalOk = g >= 1000 && g <= 50000;
  const budgetOk = b >= 1000 && b <= 10_000_000;
  const dirty = g !== state.stepGoal || b !== state.budget || city !== state.city || topics.join() !== state.topics.join();

  const save = () => {
    if (!goalOk || !budgetOk) return;
    update((s) => ({ ...s, stepGoal: Math.round(g), budget: Math.round(b), city, topics }));
    toast.success("Settings saved", { description: "Your changes now show across Orbit." });
  };

  return (
    <Page className="max-w-3xl space-y-7 pt-6">
      <section>
        <SectionHeader title="Appearance" />
        <div className="card-orbit p-5">
          <SegmentTabs id="theme" label="Theme" options={["Dark", "Light"] as const} value={state.theme === "dark" ? "Dark" : "Light"} onChange={(v) => update((s) => ({ ...s, theme: v === "Dark" ? "dark" : "light" }))} />
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">{state.theme === "dark" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />} Applies instantly and is remembered on this device.</p>
        </div>
      </section>

      <section>
        <SectionHeader title="Goals & budget" />
        <div className="card-orbit grid gap-4 p-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">Daily step target</span>
            <input inputMode="numeric" value={goal} onChange={(e) => setGoal(e.target.value.replace(/\D/g, ""))} className="mt-2 h-12 w-full rounded-2xl border bg-surface-2/50 px-4 font-display text-lg font-semibold outline-none focus:border-primary tnum" aria-invalid={!goalOk} />
            {!goalOk && <span className="mt-1 block text-xs text-destructive">Between 1,000 and 50,000</span>}
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Monthly budget (₹)</span>
            <input inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))} className="mt-2 h-12 w-full rounded-2xl border bg-surface-2/50 px-4 font-display text-lg font-semibold outline-none focus:border-primary tnum" aria-invalid={!budgetOk} />
            {!budgetOk && <span className="mt-1 block text-xs text-destructive">At least ₹1,000</span>}
          </label>
        </div>
      </section>

      <section>
        <SectionHeader title="Feed" eyebrow="City & topics" />
        <div className="card-orbit space-y-5 p-5">
          <div>
            <p className="text-sm font-semibold">City <span className="font-normal text-muted-foreground">· used for the City feed</span></p>
            <div className="mt-2 flex flex-wrap gap-2">{CITIES.map((c) => <Chip key={c} active={city === c} onClick={() => setCity(c)}>{c}</Chip>)}</div>
          </div>
          <div>
            <p className="text-sm font-semibold">Topics for "For You"</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TOPICS.map((t) => <Chip key={t} active={topics.includes(t)} onClick={() => setTopics((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))}>{t}</Chip>)}
            </div>
            {topics.length === 0 && <p className="mt-2 text-xs text-muted-foreground">No topics selected, so For You will show everything.</p>}
          </div>
        </div>
      </section>

      <div className="sticky bottom-[calc(6.5rem+env(safe-area-inset-bottom))] z-10 lg:bottom-6">
        <PrimaryButton className="shadow-float w-full" disabled={!dirty || !goalOk || !budgetOk} onClick={save}>{dirty ? "Save changes" : "All changes saved"}</PrimaryButton>
      </div>

      <section>
        <SectionHeader title="Integrations" />
        <Link to="/connections" className="card-orbit flex items-center gap-3 p-5">
          <span className="grid size-11 place-items-center rounded-2xl bg-surface-2"><Plug className="size-5 text-muted-foreground" /></span>
          <div className="flex-1"><p className="font-semibold">Connections</p><p className="text-xs text-muted-foreground">Laptop agent, health, brokers, news · none connected</p></div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      </section>

      <section>
        <SectionHeader title="Demo data" />
        <div className="card-orbit p-5">
          <p className="text-sm text-muted-foreground">Everything in Orbit is synthetic. Your edits (expenses, reflections, bookmarks, chat, preferences) live only in this browser.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 text-sm font-semibold text-destructive"><RotateCcw className="size-4" /> Reset demo data</button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all demo data?</AlertDialogTitle>
                <AlertDialogDescription>This clears your added expenses, reflections, bookmarks, chat history and preferences, and restores the original sample data.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => { reset(); toast.success("Demo data reset"); }}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </Page>
  );
}
