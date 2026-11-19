import { describe, expect, it } from "vitest";
import { seedDay } from "@/lib/orbit/activity";
import { paceContext } from "@/lib/orbit/pace";
const today = "2026-11-19";
describe("Pace contextual responses", () => {
  it("waits neutrally when no steps exist", () => { expect(paceContext({ ...seedDay(today, today), steps: null }, 10000, today).mood).toBe("waiting"); });
  it("supports the 7420-step current day without treating it as missed", () => { expect(paceContext(seedDay(today, today), 10000, today).mood).toBe("idle"); });
  it("celebrates when stored goal is reached", () => { expect(paceContext(seedDay(today, today), 6000, today).mood).toBe("complete"); });
  it("cheers near a goal without claiming completion", () => { expect(paceContext({ ...seedDay(today, today), steps: 9500 }, 10000, today).mood).toBe("ready"); });
  it("keeps below-goal historical days calm", () => { expect(paceContext({ ...seedDay(today, today), date: "2026-11-18" }, 10000, today).mood).toBe("rest"); });
  it("keeps planned rest calm", () => { expect(paceContext({ ...seedDay(today, today), date: "2026-11-18", plannedRest: true }, 10000, today).mood).toBe("rest"); });
});