import { HealthSheet } from "./HealthSheet";
import { PaceCompanion } from "./PaceCompanion";
import type { DayActivity } from "@/lib/orbit/activity";

export function StartActivity({ open, onOpenChange, day }: { open: boolean; onOpenChange: (open: boolean) => void; day: DayActivity }) {
  return <HealthSheet open={open} onOpenChange={onOpenChange} title="A little movement. A fresh start." description="Activity preview · no GPS, sensors or workout recording.">
    <PaceCompanion day={day} preview enabled={open} />
  </HealthSheet>;
}