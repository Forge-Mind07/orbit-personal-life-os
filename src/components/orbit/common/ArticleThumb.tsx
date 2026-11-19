import { cn } from "@/lib/utils";

/** Original abstract editorial artwork generated from two hues. No external images. */
export function ArticleThumb({ hues, className, seed = 0 }: { hues: [number, number]; className?: string; seed?: number }) {
  const [a, b] = hues;
  const x = 20 + ((seed * 37) % 60);
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 90% at ${x}% 0%, oklch(0.72 0.14 ${a} / 0.95), transparent 60%), radial-gradient(90% 90% at 100% 100%, oklch(0.62 0.16 ${b} / 0.9), transparent 65%), oklch(0.24 0.04 ${a})`,
      }}
    >
      <div className="absolute -right-6 -top-6 size-24 rounded-full border border-foreground/15" />
      <div className="absolute -bottom-10 left-6 size-32 rounded-full border border-foreground/10" />
      <div className="absolute bottom-3 right-3 h-px w-1/3" style={{ background: `oklch(0.95 0.03 ${b} / 0.5)` }} />
    </div>
  );
}
