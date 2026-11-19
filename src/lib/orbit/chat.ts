import type { ISODate } from "./dates";
import { computeInsights, streaks, summarize, weekDates } from "./activity";
import { categoryTotals, inMonth, portfolioSummary, sumAmounts, type Expense } from "./finance";
import { briefingFor, cityize, type Topic } from "./feed";
import { formatINR, formatNum } from "./format";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: number;
  status?: "error";
}

export const QUICK_PROMPTS = [
  "Summarize my week of activity",
  "How are my expenses this month?",
  "What should I read today?",
  "How is my portfolio doing?",
];

export interface ChatContext {
  today: ISODate;
  goal: number;
  budget: number;
  expenses: Expense[];
  topics: Topic[];
  city: string;
}

/** Deterministic demo replies grounded in the same state the screens show. */
export function demoReply(input: string, ctx: ChatContext): { text: string; error?: boolean } {
  const t = input.toLowerCase();
  if (/laptop|file|folder|run on my|terminal/.test(t)) {
    return { error: true, text: "The laptop agent is offline, so I can't reach files or run tasks there yet. Device wiring comes in a later build." };
  }
  if (/week|activity|steps|walk|health|fitness/.test(t)) {
    const s = summarize(weekDates(ctx.today).filter((d) => d <= ctx.today), ctx.goal, ctx.today);
    const st = streaks(ctx.goal, ctx.today);
    const ins = computeInsights(ctx.goal, ctx.today)[0];
    return {
      text: `Here's your week so far:\n\n• Average ${formatNum(s.avgSteps)} steps/day across ${s.days.length} days\n• Goal met on ${s.completed} day${s.completed === 1 ? "" : "s"}${s.rest ? `, ${s.rest} planned rest` : ""}\n• ${s.totalKm} km covered${s.best ? `, best day ${formatNum(s.best.steps ?? 0)} steps` : ""}\n• Current streak: ${st.current} day${st.current === 1 ? "" : "s"}\n\n${ins?.body ?? ""} Today you're at 7,420 steps, so a 25-minute evening walk would likely close the gap.`,
    };
  }
  if (/expense|spend|spent|budget|money/.test(t)) {
    const month = ctx.expenses.filter((e) => inMonth(e, ctx.today));
    const total = sumAmounts(month);
    const cats = categoryTotals(month).slice(0, 3);
    const pct = Math.round((total / ctx.budget) * 100);
    return {
      text: `You've spent ${formatINR(total)} of your ${formatINR(ctx.budget)} budget this month (${pct}%), with ${formatINR(Math.max(0, ctx.budget - total))} remaining.\n\nTop categories:\n${cats.map((c) => `• ${c.category}: ${formatINR(c.total)}`).join("\n")}\n\n${pct < 70 ? "You're pacing comfortably." : "You're getting close to the limit. Maybe keep the next few days light."}`,
    };
  }
  if (/read|news|feed|article|brief/.test(t)) {
    const picks = briefingFor(ctx.topics);
    return {
      text: `Three picks matched to your topics (illustrative demo articles):\n\n${picks.map((a) => `• ${cityize(a.title, ctx.city)} (${a.readMin} min)`).join("\n")}\n\nOpen Feed to read them in full.`,
    };
  }
  if (/portfolio|invest|stock|holding|market/.test(t)) {
    const p = portfolioSummary();
    return {
      text: `Your demo portfolio is worth ${formatINR(p.value)} against ${formatINR(p.invested)} invested, an unrealised gain of ${formatINR(p.pnl)} (${p.pnlPct.toFixed(1)}%).\n\nIT is your largest sector. Tata Motors is the only holding below cost. These are sample holdings, not live prices.`,
    };
  }
  return {
    text: "I'm the demo assistant, so I can answer questions about your sample activity, expenses, portfolio and feed. Try one of the suggested prompts, or ask about your week, budget or reading list.",
  };
}
