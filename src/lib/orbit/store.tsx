import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toISO, type ISODate } from "./dates";
import { seedExpenses, type Category, type Expense } from "./finance";
import type { Topic } from "./feed";
import type { ChatMessage } from "./chat";

export type ReflectionReason = "Busy" | "Unwell" | "Rest/recovery" | "Weather" | "Travel" | "Forgot" | "Other";
export const REFLECTION_REASONS: ReflectionReason[] = ["Busy", "Unwell", "Rest/recovery", "Weather", "Travel", "Forgot", "Other"];

export interface Reflection {
  reason: ReflectionReason;
  note: string;
  savedAt: number;
}

export interface OrbitState {
  version: 1;
  name: string;
  theme: "dark" | "light";
  stepGoal: number;
  budget: number;
  city: string;
  topics: Topic[];
  reflections: Record<ISODate, Reflection>;
  /** Missed days the user chose to skip reflecting on */
  skipped: ISODate[];
  bookmarks: string[];
  expenses: Expense[];
  chat: ChatMessage[];
  laptop: { mode: "lan" | "tailscale" | "custom"; endpoint: string };
  readNotifications: string[];
}

export const DEFAULT_STATE: OrbitState = {
  version: 1,
  name: "Mithun",
  theme: "dark",
  stepGoal: 10000,
  budget: 15000,
  city: "Chennai",
  topics: ["AI", "Technology", "Finance"],
  reflections: {},
  skipped: [],
  bookmarks: [],
  expenses: [],
  chat: [],
  laptop: { mode: "lan", endpoint: "http://192.168.1.20:8787" },
  readNotifications: [],
};

const KEY = "orbit.demo.v1";

interface OrbitCtx {
  state: OrbitState;
  ready: boolean;
  today: ISODate;
  update: (fn: (s: OrbitState) => OrbitState) => void;
  reset: () => void;
  allExpenses: Expense[];
  addExpense: (e: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;
  toggleBookmark: (id: string) => boolean;
}

const Ctx = createContext<OrbitCtx | null>(null);

export function OrbitProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OrbitState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState<ISODate>("2026-01-01");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<OrbitState>) });
    } catch {
      /* corrupt storage: fall back to defaults */
    }
    setToday(toISO(new Date()));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle("dark", state.theme === "dark");
    el.style.colorScheme = state.theme;
  }, [state.theme]);

  const update = useCallback((fn: (s: OrbitState) => OrbitState) => setState(fn), []);
  const reset = useCallback(() => {
    localStorage.removeItem(KEY);
    setState(DEFAULT_STATE);
  }, []);

  const allExpenses = useMemo(
    () => [...seedExpenses(today), ...state.expenses].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [today, state.expenses],
  );

  const addExpense = useCallback((e: Omit<Expense, "id">) => {
    setState((s) => ({ ...s, expenses: [...s.expenses, { ...e, id: `u-${Date.now()}` }] }));
  }, []);
  const removeExpense = useCallback((id: string) => {
    setState((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== id) }));
  }, []);
  const toggleBookmark = useCallback(
    (id: string) => {
      const on = !state.bookmarks.includes(id);
      setState((s) => ({ ...s, bookmarks: on ? [...s.bookmarks, id] : s.bookmarks.filter((b) => b !== id) }));
      return on;
    },
    [state.bookmarks],
  );

  const value = useMemo(
    () => ({ state, ready, today, update, reset, allExpenses, addExpense, removeExpense, toggleBookmark }),
    [state, ready, today, update, reset, allExpenses, addExpense, removeExpense, toggleBookmark],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrbit() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOrbit must be used inside OrbitProvider");
  return c;
}

export type { Category };
