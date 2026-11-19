const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const inr2 = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatINR = (n: number) => `${n < 0 ? "−" : ""}₹${inr.format(Math.abs(Math.round(n)))}`;
export const formatINR2 = (n: number) => `₹${inr2.format(n)}`;
export const formatCompactINR = (n: number) => {
  const a = Math.abs(n);
  if (a >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (a >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
  if (a >= 1e3) return `₹${(n / 1e3).toFixed(1)}k`;
  return `₹${Math.round(n)}`;
};
export const formatNum = (n: number) => inr.format(Math.round(n));
export const formatPct = (n: number, digits = 1) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(digits)}%`;
