import { useEffect, useState } from "react";
import { NotebookPen } from "lucide-react";
import { toast } from "sonner";
import { HealthSheet as BottomSheet } from "./HealthSheet";
import { Button } from "@/components/ui/button";
import { GhostButton, PrimaryButton, Stat } from "../common/bits";
import { canReflect, dayStatus, seedDay } from "@/lib/orbit/activity";
import { fmt, type ISODate } from "@/lib/orbit/dates";
import { REFLECTION_REASONS, useOrbit, type ReflectionReason } from "@/lib/orbit/store";
import { formatNum } from "@/lib/orbit/format";
import { STATUS_COLOR, STATUS_LABEL } from "./statusStyle";
import { cn } from "@/lib/utils";

export function DayInspector({ date, onClose }: { date: ISODate | null; onClose: () => void }) {
  const { state, today, update } = useOrbit();
  const [mode, setMode] = useState<"detail" | "reflect">("detail");
  const [reason, setReason] = useState<ReflectionReason | null>(null);
  const [note, setNote] = useState("");

  const day = date ? seedDay(date, today) : null;
  const status = day ? dayStatus(day, state.stepGoal, today) : null;
  const reflection = date ? state.reflections[date] : undefined;

  useEffect(() => {
    if (!date || !status) return;
    const r = state.reflections[date];
    setReason(r?.reason ?? null);
    setNote(r?.note ?? "");
    setMode(canReflect(status) && !r && !state.skipped.includes(date) ? "reflect" : "detail");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  if (!date || !day || !status) return <BottomSheet open={false} onOpenChange={() => {}} title="">{null}</BottomSheet>;

  const save = () => {
    if (!reason) return;
    update((s) => ({ ...s, reflections: { ...s.reflections, [date]: { reason, note: note.trim(), savedAt: Date.now() } }, skipped: s.skipped.filter((d) => d !== date) }));
    toast.success("Reflection saved", { description: "Thanks for checking in. It's part of the story, not a mark against you." });
    setMode("detail");
  };
  const skip = () => {
    update((s) => ({ ...s, skipped: s.skipped.includes(date) ? s.skipped : [...s.skipped, date] }));
    setMode("detail");
  };

  if (mode === "reflect") {
    return (
      <BottomSheet
        open
        onOpenChange={(o) => !o && onClose()}
        title={`${fmt(date, "EEEE, d MMM")}`}
        description={`${formatNum(day.steps ?? 0)} steps. Want to note what shaped this day? Totally optional.`}
        footer={
          <div className="flex gap-3">
            <GhostButton className="flex-1" onClick={skip}>Skip</GhostButton>
            <PrimaryButton className="flex-1" disabled={!reason} onClick={save}>Save reflection</PrimaryButton>
          </div>
        }
      >
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">What got in the way?</legend>
          <div className="flex flex-wrap gap-2">
            {REFLECTION_REASONS.map((r) => (
              <Button variant="ghost"
                key={r}
                type="button"
                aria-pressed={reason === r}
                onClick={() => setReason(r)}
                className={cn("min-h-11 rounded-2xl border px-4 text-sm font-semibold transition-all", reason === r ? "border-transparent bg-health text-on-accent" : "bg-surface-2/60 text-muted-foreground hover:text-foreground")}
              >
                {r}
              </Button>
            ))}
          </div>
        </fieldset>
        <label className="mt-6 block text-sm font-semibold" htmlFor="reflect-note">Note <span className="font-normal text-muted-foreground">(optional)</span></label>
        <textarea
          id="reflect-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={240}
          placeholder="e.g. Long meetings, walked to the station instead"
          className="mt-2 w-full resize-none rounded-2xl border bg-surface-2/50 p-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </BottomSheet>
    );
  }

  const total = day.steps ?? 0;
  const parts = [
    { k: "Everyday movement", v: day.breakdown.everyday, c: "var(--feed)" },
    { k: "Brisk walk", v: day.breakdown.brisk, c: "var(--health)" },
    { k: "Jog", v: day.breakdown.jog, c: "var(--primary)" },
    { k: "Run", v: day.breakdown.run, c: "var(--finance)" },
  ];
  return (
    <BottomSheet open onOpenChange={(o) => !o && onClose()} title={fmt(date, "EEEE, d MMMM")} description={day.isSampleToday ? "Today's sample activity" : "Synthetic demo history"}>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold">
          <span className="size-2 rounded-full" style={{ background: STATUS_COLOR[status] }} />
          {STATUS_LABEL[status]}
        </span>
        {day.plannedRest && status !== "rest" && <span className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-muted-foreground">Planned rest</span>}
      </div>
      {status === "nodata" || status === "future" ? (
        <p className="mt-5 rounded-2xl bg-surface-2/60 p-4 text-sm text-muted-foreground">
          {status === "nodata" ? "No activity was recorded for this day, perhaps the phone stayed home. Missing data isn't counted as a missed day." : "This day hasn't happened yet."}
        </p>
      ) : (
        <>
          <p className="mt-5 font-display text-5xl font-bold tracking-tight tnum">{formatNum(total)}<span className="ml-2 text-base font-medium text-muted-foreground">/ {formatNum(state.stepGoal)} steps</span></p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Stat label="Distance" value={`${day.distanceKm} km`} />
            <Stat label="Moving" value={`${day.activeMin} min`} />
            <Stat label="Of goal" value={`${Math.round((total / state.stepGoal) * 100)}%`} />
          </div>
          <div className="mt-5">
            <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-2">
              {parts.map((p) => p.v > 0 && <div key={p.k} style={{ width: `${(p.v / total) * 100}%`, background: p.c }} />)}
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {parts.map((p) => (
                <li key={p.k} className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ background: p.c }} />
                  {p.k}
                  <span className="ml-auto font-semibold text-foreground tnum">{formatNum(p.v)}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {canReflect(status) && (
        <div className="mt-6 rounded-2xl border p-4">
          <div className="flex items-center gap-2 text-sm font-semibold"><NotebookPen className="size-4 text-health" /> Reflection</div>
          {reflection ? (
            <>
              <p className="mt-2 text-sm"><span className="font-semibold">{reflection.reason}</span>{reflection.note && <span className="text-muted-foreground"> · {reflection.note}</span>}</p>
              <Button variant="ghost" className="mt-3 min-h-10 text-sm font-semibold text-primary" onClick={() => setMode("reflect")}>Edit reflection</Button>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted-foreground">No reflection yet. Adding context helps Orbit spot patterns kindly.</p>
              <Button variant="ghost" className="mt-3 min-h-10 text-sm font-semibold text-primary" onClick={() => setMode("reflect")}>Add reflection</Button>
            </>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
