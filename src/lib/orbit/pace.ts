import { dayStatus, type DayActivity } from "./activity";
import type { ISODate } from "./dates";

export type PaceMood = "waiting" | "idle" | "rest" | "ready" | "complete";
export type PaceAction = "idle" | "wave" | "run" | "cheer" | "celebrate";
export const PACE_OUTFITS = ["apricot", "lagoon", "berry", "sunshine"] as const;
export type PaceOutfit = (typeof PACE_OUTFITS)[number];
export function paceContext(day: DayActivity, goal: number, today: ISODate): { mood: PaceMood; message: string } {
  const status = dayStatus(day, goal, today);
  if (day.steps === null || day.steps === 0) return { mood: "waiting", message: "No rush. I'll be here when you're ready." };
  if (day.steps >= goal) return { mood: "complete", message: "Your target is reached. Look at you go!" };
  if (status === "rest" || status === "missed") return { mood: "rest", message: day.plannedRest ? "Rest is part of your rhythm. Let's take it easy." : "A softer day. You're still doing just fine." };
  if (day.steps / goal >= 0.9) return { mood: "ready", message: "So close! A little more, only if it feels good." };
  return { mood: "idle", message: "Small steps. Good energy. Your kind of pace." };
}