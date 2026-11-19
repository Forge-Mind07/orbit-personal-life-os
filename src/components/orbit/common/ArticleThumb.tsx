import { cn } from "@/lib/utils";

/** Original deterministic signal-field artwork; no copied or external media. */
export function ArticleThumb({ hues, className, seed = 0 }: { hues: [number, number]; className?: string; seed?: number }) {
  const phase = (hues[0] + seed * 17) / 40;
  const waves = Array.from({ length: 18 }, (_, row) =>
    Array.from({ length: 65 }, (_, column) => {
      const x = column * 10;
      const y = 45 + row * 7 + Math.sin(column / 8 + phase + row / 10) * 25 + Math.cos(column / 13 + row / 5) * 15;
      return { x, y, signal: (column + row * 7 + seed) % 23 === 0 };
    }),
  );
  return (
    <div aria-hidden className={cn("orbit-technical-art relative overflow-hidden", className)}>
      <svg viewBox="0 0 640 240" preserveAspectRatio="xMidYMid slice">
        <g className="art-wave">
          {waves.map((wave, row) => (
            <g key={row}>
              <polyline points={wave.map(({ x, y }) => `${x},${y}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.3" />
              {wave.map(({ x, y, signal }, col) => <circle key={col} cx={x} cy={y} r={signal ? 2 : 0.7} className={signal ? "signal" : undefined} fill="currentColor" opacity={signal ? 1 : 0.65} />)}
            </g>
          ))}
        </g>
        <path d="M24 24h16m-8-8v16M600 216h16m-8-8v16" stroke="currentColor" fill="none" />
      </svg>
    </div>
  );
}
