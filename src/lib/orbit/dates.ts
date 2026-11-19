import { format } from "date-fns";

/** Local calendar date as `yyyy-mm-dd`. Comparable as strings. */
export type ISODate = string;

const pad = (n: number) => String(n).padStart(2, "0");

export function toISO(d: Date): ISODate {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function fromISO(s: ISODate): Date {
  const [y = 1970, m = 1, d = 1] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(s: ISODate, n: number): ISODate {
  const d = fromISO(s);
  d.setDate(d.getDate() + n);
  return toISO(d);
}
export function diffDays(a: ISODate, b: ISODate): number {
  return Math.round((fromISO(a).getTime() - fromISO(b).getTime()) / 86400000);
}
/** Monday = 0 … Sunday = 6 */
export function weekdayIndex(s: ISODate): number {
  return (fromISO(s).getDay() + 6) % 7;
}
export function startOfWeek(s: ISODate): ISODate {
  return addDays(s, -weekdayIndex(s));
}
export function startOfMonth(s: ISODate): ISODate {
  return `${s.slice(0, 7)}-01`;
}
export function addMonths(s: ISODate, n: number): ISODate {
  const d = fromISO(startOfMonth(s));
  d.setMonth(d.getMonth() + n);
  return toISO(d);
}
export function daysInMonth(s: ISODate): number {
  const d = fromISO(s);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}
export function range(start: ISODate, count: number): ISODate[] {
  return Array.from({ length: count }, (_, i) => addDays(start, i));
}
export function fmt(s: ISODate, pattern: string): string {
  return format(fromISO(s), pattern);
}
export function relativeDayLabel(s: ISODate, today: ISODate): string {
  const d = diffDays(today, s);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d > 1 && d < 7) return fmt(s, "EEEE");
  return fmt(s, "d MMM");
}
