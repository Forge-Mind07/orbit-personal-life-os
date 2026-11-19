import { addDays, addMonths, fmt, fromISO, startOfMonth, toISO, type ISODate } from "./dates";
import { hash01 } from "./activity";

export type Category = "Food" | "Groceries" | "Transport" | "Bills" | "Shopping" | "Health" | "Entertainment" | "Other";
export type PaymentType = "UPI" | "Card" | "Cash" | "Bank";

export const CATEGORIES: { id: Category; color: string }[] = [
  { id: "Food", color: "var(--cat-food)" },
  { id: "Groceries", color: "var(--cat-groceries)" },
  { id: "Transport", color: "var(--cat-transport)" },
  { id: "Bills", color: "var(--cat-bills)" },
  { id: "Shopping", color: "var(--cat-shopping)" },
  { id: "Health", color: "var(--cat-health)" },
  { id: "Entertainment", color: "var(--cat-entertainment)" },
  { id: "Other", color: "var(--cat-other)" },
];
export const categoryColor = (c: Category) => CATEGORIES.find((x) => x.id === c)?.color ?? "var(--cat-other)";
export const PAYMENT_TYPES: PaymentType[] = ["UPI", "Card", "Cash", "Bank"];

export interface Expense {
  id: string;
  /** Whole rupees */
  amount: number;
  description: string;
  merchant?: string;
  category: Category;
  date: ISODate;
  payment: PaymentType;
  source: "seed" | "manual" | "voice";
}

const SEED: [number, number, string, string, Category, PaymentType][] = [
  [1, 1151, "TNEB", "Electricity bill", "Bills", "Bank"],
  [2, 599, "Airtel", "Mobile & broadband", "Bills", "UPI"],
  [3, 1240, "Nilgiris", "Weekly groceries", "Groceries", "Card"],
  [4, 320, "Saravana Bhavan", "Dinner", "Food", "UPI"],
  [6, 300, "Chennai Metro", "Metro card top-up", "Transport", "UPI"],
  [7, 899, "Amazon", "Desk lamp", "Shopping", "Card"],
  [9, 540, "Swiggy", "Weekend order", "Food", "UPI"],
  [10, 780, "Indian Oil", "Fuel", "Transport", "Card"],
  [11, 351, "Apollo Pharmacy", "Vitamins", "Health", "UPI"],
  [12, 860, "BigBasket", "Groceries top-up", "Groceries", "UPI"],
  [14, 350, "PVR Cinemas", "Movie night", "Entertainment", "Card"],
  [15, 460, "Zomato", "Dinner order", "Food", "UPI"],
  [16, 420, "Uber", "Ride to T. Nagar", "Transport", "UPI"],
  [18, 180, "Filter Coffee Co.", "Coffee & snacks", "Food", "Cash"],
];
export const SEED_MONTH_TOTAL = 8450;

/** Seed expenses for the current month; dates clamp to today so nothing is in the future. */
export function seedExpenses(today: ISODate): Expense[] {
  const todayDay = fromISO(today).getDate();
  const first = startOfMonth(today);
  return SEED.map(([d, amount, merchant, description, category, payment], i) => ({
    id: `seed-${i}`,
    amount,
    merchant,
    description,
    category,
    payment,
    date: addDays(first, Math.min(d, todayDay) - 1),
    source: "seed" as const,
  }));
}

/** Totals for the five months before the current one (synthetic history). */
export const PRIOR_MONTH_TOTALS = [12800, 11950, 13400, 10900, 12250];

export const inMonth = (e: Expense, anyDay: ISODate) => e.date.slice(0, 7) === anyDay.slice(0, 7);
export const sumAmounts = (list: Expense[]) => list.reduce((t, e) => t + e.amount, 0);

export function monthlyTrend(all: Expense[], today: ISODate) {
  const prior = PRIOR_MONTH_TOTALS.map((total, i) => {
    const m = addMonths(today, i - 5);
    return { month: m, label: fmt(m, "MMM"), total };
  });
  return [...prior, { month: startOfMonth(today), label: fmt(today, "MMM"), total: sumAmounts(all.filter((e) => inMonth(e, today))) }];
}

export function categoryTotals(list: Expense[]) {
  return CATEGORIES.map((c) => ({
    category: c.id,
    color: c.color,
    total: sumAmounts(list.filter((e) => e.category === c.id)),
  }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
}

/** Cumulative spend per day of the current month up to today. */
export function cumulativeDaily(list: Expense[], today: ISODate) {
  const first = startOfMonth(today);
  const n = fromISO(today).getDate();
  let run = 0;
  return Array.from({ length: n }, (_, i) => {
    const d = addDays(first, i);
    run += sumAmounts(list.filter((e) => e.date === d));
    return { date: d, total: run };
  });
}

const KEYWORDS: [Category, string[]][] = [
  ["Food", ["lunch", "dinner", "breakfast", "coffee", "tea", "snack", "swiggy", "zomato", "restaurant", "cafe", "café", "food", "biryani", "dosa", "idli", "pizza", "bhavan", "meal"]],
  ["Groceries", ["grocery", "groceries", "vegetables", "veggies", "milk", "bigbasket", "nilgiris", "zepto", "blinkit", "fruits", "supermarket", "dmart"]],
  ["Transport", ["uber", "ola", "auto", "metro", "bus", "train", "fuel", "petrol", "diesel", "cab", "taxi", "rapido", "parking", "toll"]],
  ["Bills", ["bill", "electricity", "tneb", "recharge", "airtel", "jio", "broadband", "wifi", "rent", "gas", "water"]],
  ["Shopping", ["amazon", "flipkart", "myntra", "clothes", "shoes", "shopping", "gift", "lamp", "gadget"]],
  ["Health", ["pharmacy", "medicine", "apollo", "doctor", "clinic", "gym", "hospital", "vitamins", "medplus"]],
  ["Entertainment", ["movie", "pvr", "netflix", "spotify", "concert", "game", "inox", "show", "prime"]],
];

/** Keyword-based category guess. Rules only, no ML. */
export function detectCategory(text: string): Category {
  const t = text.toLowerCase();
  for (const [cat, words] of KEYWORDS) if (words.some((w) => t.includes(w))) return cat;
  return "Other";
}

// ---------- Investments (demo) ----------
export interface Holding {
  symbol: string;
  name: string;
  sector: string;
  qty: number;
  avgPrice: number;
  ltp: number;
}
export const HOLDINGS: Holding[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", qty: 12, avgPrice: 2480, ltp: 2915 },
  { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking", qty: 20, avgPrice: 1540, ltp: 1688 },
  { symbol: "INFY", name: "Infosys", sector: "IT", qty: 15, avgPrice: 1460, ltp: 1872 },
  { symbol: "ITC", name: "ITC Ltd", sector: "FMCG", qty: 60, avgPrice: 412, ltp: 438 },
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT", qty: 6, avgPrice: 3620, ltp: 4105 },
  { symbol: "TATAMOTORS", name: "Tata Motors", sector: "Auto", qty: 25, avgPrice: 980, ltp: 912 },
  { symbol: "NIFTYBEES", name: "Nippon India Nifty 50 BeES", sector: "Index ETF", qty: 80, avgPrice: 228, ltp: 262 },
];
export const SECTOR_COLORS: Record<string, string> = {
  Energy: "var(--cat-food)",
  Banking: "var(--cat-transport)",
  IT: "var(--cat-bills)",
  FMCG: "var(--cat-groceries)",
  Auto: "var(--cat-shopping)",
  "Index ETF": "var(--cat-health)",
};

export const holdingValue = (h: Holding) => h.qty * h.ltp;
export const holdingInvested = (h: Holding) => h.qty * h.avgPrice;

export function portfolioSummary(list: Holding[] = HOLDINGS) {
  const value = list.reduce((t, h) => t + holdingValue(h), 0);
  const invested = list.reduce((t, h) => t + holdingInvested(h), 0);
  const pnl = value - invested;
  return { value, invested, pnl, pnlPct: (pnl / invested) * 100 };
}

export function sectorAllocation(list: Holding[] = HOLDINGS) {
  const total = portfolioSummary(list).value;
  const map = new Map<string, number>();
  for (const h of list) map.set(h.sector, (map.get(h.sector) ?? 0) + holdingValue(h));
  return [...map.entries()]
    .map(([sector, value]) => ({ sector, value, pct: (value / total) * 100, color: SECTOR_COLORS[sector] ?? "var(--cat-other)" }))
    .sort((a, b) => b.value - a.value);
}

export type Period = "1M" | "3M" | "6M" | "1Y" | "ALL";
const PERIODS: Record<Period, { n: number; stepDays: number; startFrac: number }> = {
  "1M": { n: 30, stepDays: 1, startFrac: 0.968 },
  "3M": { n: 13, stepDays: 7, startFrac: 0.935 },
  "6M": { n: 26, stepDays: 7, startFrac: 0.905 },
  "1Y": { n: 52, stepDays: 7, startFrac: 0.86 },
  ALL: { n: 36, stepDays: 30, startFrac: 0.62 },
};

/** Deterministic sample snapshots that always end exactly at the current value. */
export function valueSeries(key: string, current: number, period: Period, today: ISODate) {
  const { n, stepDays, startFrac } = PERIODS[period];
  const start = current * startFrac;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const wiggle = i === n - 1 ? 0 : (hash01(`${key}:${period}:${i}`) - 0.5) * current * 0.03 * Math.sin(Math.PI * t + 0.3);
    const date = addDays(today, -(n - 1 - i) * stepDays);
    return { date, label: fmt(date, stepDays >= 30 ? "MMM yy" : "d MMM"), value: Math.round(start + (current - start) * t + wiggle) };
  });
}

export const todayISO = () => toISO(new Date());
