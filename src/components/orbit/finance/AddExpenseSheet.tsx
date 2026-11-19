import { useEffect, useState } from "react";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import { BottomSheet } from "../common/BottomSheet";
import { PrimaryButton } from "../common/bits";
import { CATEGORIES, PAYMENT_TYPES, categoryColor, detectCategory, type Category, type Expense, type PaymentType } from "@/lib/orbit/finance";
import { useOrbit } from "@/lib/orbit/store";
import { formatINR } from "@/lib/orbit/format";
import { CATEGORY_ICON } from "./icons";
import { cn } from "@/lib/utils";

export interface ExpenseDraft {
  amount: string;
  description: string;
  category: Category | null;
  date: string;
  payment: PaymentType;
  source: Expense["source"];
}

export function AddExpenseSheet({ open, onOpenChange, initial }: { open: boolean; onOpenChange: (o: boolean) => void; initial?: Partial<ExpenseDraft> | undefined }) {
  const { today, addExpense } = useOrbit();
  const blank: ExpenseDraft = { amount: "", description: "", category: null, date: today, payment: "UPI", source: "manual" };
  const [d, setD] = useState<ExpenseDraft>(blank);
  useEffect(() => { if (open) setD({ ...blank, ...initial }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const auto = detectCategory(d.description);
  const category = d.category ?? auto;
  const amount = Math.round(Number(d.amount));
  const valid = amount > 0 && amount < 10_000_000 && d.description.trim().length > 0 && d.date <= today;

  const save = () => {
    if (!valid) return;
    addExpense({ amount, description: d.description.trim(), category, date: d.date, payment: d.payment, source: d.source });
    toast.success(`${formatINR(amount)} added to ${category}`, { description: "Totals and charts updated." });
    onOpenChange(false);
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Add expense" description="Saved locally on this device as demo data." footer={<PrimaryButton className="w-full" disabled={!valid} onClick={save}>Save expense</PrimaryButton>}>
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <label className="block">
          <span className="text-sm font-semibold">Amount</span>
          <div className="mt-2 flex items-center rounded-2xl border bg-surface-2/50 px-4 focus-within:border-primary">
            <span className="font-display text-3xl font-semibold text-muted-foreground">₹</span>
            <input inputMode="numeric" autoFocus value={d.amount} onChange={(e) => setD({ ...d, amount: e.target.value.replace(/[^\d]/g, "") })} placeholder="0" className="h-16 w-full bg-transparent pl-2 font-display text-3xl font-semibold outline-none tnum" aria-label="Amount in rupees" />
          </div>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Description</span>
          <input value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} placeholder="e.g. Lunch at Murugan Idli" maxLength={60} className="mt-2 h-12 w-full rounded-2xl border bg-surface-2/50 px-4 text-sm outline-none focus:border-primary" />
        </label>
        <fieldset>
          <legend className="flex w-full items-center justify-between text-sm font-semibold">
            Category
            {d.category === null && d.description && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"><Wand2 className="size-3" /> Auto-detected from keywords</span>
            )}
          </legend>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICON[c.id];
              const active = category === c.id;
              return (
                <button type="button" key={c.id} aria-pressed={active} onClick={() => setD({ ...d, category: c.id })} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border text-[11px] font-semibold transition-all", active ? "border-transparent bg-surface-2 text-foreground ring-2" : "text-muted-foreground")} style={active ? ({ "--tw-ring-color": categoryColor(c.id) } as React.CSSProperties) : undefined}>
                  <Icon className="size-5" style={{ color: c.color }} />
                  {c.id}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-semibold">Date</span>
            <input type="date" value={d.date} max={today} onChange={(e) => setD({ ...d, date: e.target.value })} className="mt-2 h-12 w-full rounded-2xl border bg-surface-2/50 px-3 text-sm outline-none focus:border-primary" />
          </label>
          <fieldset>
            <legend className="text-sm font-semibold">Payment</legend>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {PAYMENT_TYPES.map((p) => (
                <button type="button" key={p} aria-pressed={d.payment === p} onClick={() => setD({ ...d, payment: p })} className={cn("min-h-11 rounded-xl text-sm font-semibold", d.payment === p ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground")}>
                  {p}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </form>
    </BottomSheet>
  );
}
