import { addDays, weekdayIndex, type ISODate } from "./dates";
import { detectCategory, type Category, type PaymentType } from "./finance";

export interface ParsedExpense {
  amount: number | null;
  description: string;
  category: Category;
  date: ISODate;
  payment: PaymentType;
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DATE_WORDS = /\b(today|yesterday|day before yesterday|last\s+\w+|on\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/gi;

/** Rules-based parser for simulated voice entries like "Spent 180 rupees on lunch today". */
export function parseExpense(text: string, today: ISODate): ParsedExpense {
  const t = text.toLowerCase();
  const m = t.replace(/,(?=\d{3})/g, "").match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(k\b)?/i);
  let amount: number | null = m ? parseFloat(m[1]) * (m[2] ? 1000 : 1) : null;
  if (amount !== null) amount = Math.round(amount);

  let date = today;
  if (/day before yesterday/.test(t)) date = addDays(today, -2);
  else if (/yesterday/.test(t)) date = addDays(today, -1);
  else {
    const wd = DAYS.findIndex((d) => new RegExp(`\\b(on|last)\\s+${d}\\b`).test(t));
    if (wd >= 0) {
      let back = (weekdayIndex(today) - wd + 7) % 7;
      if (back === 0) back = 7;
      date = addDays(today, -back);
    }
  }

  let payment: PaymentType = "UPI";
  if (/\b(cash)\b/.test(t)) payment = "Cash";
  else if (/\b(card|credit|debit)\b/.test(t)) payment = "Card";
  else if (/\b(bank|transfer|neft|imps)\b/.test(t)) payment = "Bank";

  const cleaned = text
    .replace(DATE_WORDS, " ")
    .replace(/\b(via|using|by|with)\s+(upi|gpay|phonepe|paytm|cash|card|credit card|debit card|bank)\b/gi, " ")
    .replace(/\b(i\s+)?(spent|paid|spend|bought|gave)\b/gi, " ")
    .replace(/(?:₹|rs\.?|inr)?\s*\d[\d,]*(?:\.\d+)?\s*(k\b)?\s*(rupees|rupee|rs\.?|inr|bucks)?/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const phrase = cleaned.match(/\b(?:on|for|at)\s+(.+)$/i)?.[1] ?? cleaned;
  const desc = phrase.replace(/^(on|for|at)\s+/i, "").replace(/[.!?]+$/, "").trim();
  const description = desc ? desc.charAt(0).toUpperCase() + desc.slice(1) : "Expense";

  return { amount, description, category: detectCategory(text), date, payment };
}
