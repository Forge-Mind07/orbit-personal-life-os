import { describe, expect, it } from "vitest";
import { parseExpense } from "@/lib/orbit/parser";
import { dayStatus, seedDay, canReflect } from "@/lib/orbit/activity";
import { seedExpenses, sumAmounts, detectCategory, portfolioSummary } from "@/lib/orbit/finance";

const TODAY = "2026-11-19";

describe("voice parser", () => {
  it("parses the sample phrase", () => {
    const p = parseExpense("Spent 180 rupees on lunch today", TODAY);
    expect(p.amount).toBe(180);
    expect(p.category).toBe("Food");
    expect(p.date).toBe(TODAY);
    expect(p.description).toBe("Lunch");
  });
  it("understands yesterday", () => {
    expect(parseExpense("Paid 420 for uber yesterday", TODAY).date).toBe("2026-11-18");
  });
  it("detects category by keyword", () => {
    expect(detectCategory("Apollo Pharmacy")).toBe("Health");
  });
});

describe("activity rules", () => {
  it("today shows the 7,420 sample and never prompts reflection", () => {
    const d = seedDay(TODAY, TODAY);
    expect(d.steps).toBe(7420);
    expect(d.distanceKm).toBe(5.3);
    expect(canReflect(dayStatus(d, 10000, TODAY))).toBe(false);
  });
  it("no-data days are not missed days", () => {
    const d = { ...seedDay("2026-11-10", TODAY), steps: null };
    expect(dayStatus(d, 10000, TODAY)).toBe("nodata");
  });
  it("seed data is deterministic", () => {
    expect(seedDay("2026-10-03", TODAY).steps).toBe(seedDay("2026-10-03", TODAY).steps);
  });
});

describe("finance seed", () => {
  it("current month seed totals ₹8,450", () => {
    expect(sumAmounts(seedExpenses(TODAY))).toBe(8450);
  });
  it("portfolio invested matches holdings", () => {
    expect(portfolioSummary().invested).toBe(171640);
  });
});
