import { useId } from "react";

/** Original local light ribbon: no remote media or brand artwork. */
export function ChatArt({ active = false }: { active?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="chat-ribbon" data-active={active} viewBox="0 0 640 260" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-light`} x1="80" y1="80" x2="540" y2="220" gradientUnits="userSpaceOnUse">
          <stop className="ribbon-mint" /><stop offset=".5" className="ribbon-blue" /><stop offset="1" className="ribbon-mint" />
        </linearGradient>
        <linearGradient id={`${id}-accent`} x1="140" y1="150" x2="500" y2="40" gradientUnits="userSpaceOnUse">
          <stop className="ribbon-blush" /><stop offset=".5" className="ribbon-violet" /><stop offset="1" className="ribbon-amber" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>
      <g className="ribbon-flow">
        <path d="M30 178C125 206 182 37 291 104S422 229 609 62" stroke={`url(#${id}-light)`} strokeWidth="18" opacity=".32" filter={`url(#${id}-glow)`} />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M30 ${178 + i * 2}C125 ${206 - i * 4} 182 ${37 + i * 3} 291 ${104 + i}S422 ${229 - i * 5} 609 ${62 + i * 3}`} stroke={`url(#${id}-light)`} strokeWidth={i === 0 ? 2 : .7} opacity={.8 - i * .05} />)}
        <path className="ribbon-activation" d="M90 185C185 208 231 62 320 98S450 176 563 84" stroke={`url(#${id}-accent)`} strokeWidth="3" />
      </g>
    </svg>
  );
}