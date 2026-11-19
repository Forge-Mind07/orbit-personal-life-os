import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function HealthReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ type: "spring", stiffness: 150, damping: 23, delay: reduce ? 0 : delay }}>{children}</motion.div>;
}