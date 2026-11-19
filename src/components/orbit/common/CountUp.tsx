import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function CountUp({ value, duration = 1200, format = (n: number) => Math.round(n).toLocaleString("en-IN") }: { value: number; duration?: number; format?: (n: number) => string }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);
  useEffect(() => {
    if (reduce) { setN(value); return; }
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setN(from + (value - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduce]);
  return <span className="tnum">{format(n)}</span>;
}
