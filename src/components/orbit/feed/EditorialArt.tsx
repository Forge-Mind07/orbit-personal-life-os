import { useId } from "react";
import type { Topic } from "@/lib/orbit/feed";
import { cn } from "@/lib/utils";

/** Original offline editorial scenes, not photographs or depictions of real reporting. */
export function EditorialArt({ topic, className }: { topic: Topic; className?: string }) {
  const id = useId().replace(/:/g, "");
  return <div className={cn("feed-art", className)} data-scene={topic} aria-hidden="true">
    <svg viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-sky`} x2="1" y2="1"><stop className="art-stop-a"/><stop offset="1" className="art-stop-b"/></linearGradient>
        <linearGradient id={`${id}-metal`} x2=".8" y2="1"><stop className="art-stop-c"/><stop offset="1" className="art-stop-b"/></linearGradient>
        <pattern id={`${id}-grid`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" className="art-grid" fill="none"/></pattern>
      </defs>
      <rect width="640" height="480" fill={`url(#${id}-sky)`}/>
      <rect width="640" height="480" fill={`url(#${id}-grid)`} opacity=".2"/>
      {topic === "AI" && <g transform="translate(320 205) rotate(-12)">
        <path d="M-230 160Q0 90 230 160" className="art-line" fill="none" opacity=".4"/>
        <rect x="-112" y="-104" width="224" height="210" rx="55" fill={`url(#${id}-metal)`}/>
        <rect x="-88" y="-70" width="176" height="130" rx="35" className="art-dark"/>
        <rect x="-59" y="-30" width="30" height="43" rx="15" className="art-light"/><rect x="29" y="-30" width="30" height="43" rx="15" className="art-light"/>
        <path d="M-27 31Q0 50 27 31" className="art-line" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <rect x="-38" y="106" width="76" height="25" rx="12" className="art-light"/>
        <path d="M0-104V-147" className="art-line" strokeWidth="8"/><circle cy="-155" r="15" className="art-light"/>
        <circle cx="-152" cy="-70" r="23" className="art-light" opacity=".45"/><path d="M150-90h40m-20-20v40" className="art-line" strokeWidth="4"/>
      </g>}
      {topic === "Technology" && <g transform="translate(320 220) rotate(-24)">
        {[-120,-80,-40,0,40,80,120].map((x) => <g key={x}><path d={`M${x} -190v60M${x} 130v60M-190 ${x}h60M130 ${x}h60`} className="art-line" strokeWidth="10"/></g>)}
        <rect x="-130" y="-130" width="260" height="260" rx="20" fill={`url(#${id}-metal)`}/><rect x="-98" y="-98" width="196" height="196" rx="10" className="art-dark"/>
        <path d="M-65-65H65V65H-65ZM-45 0H45M0-45V45" className="art-line" fill="none" strokeWidth="3"/>
        <circle r="22" className="art-light"/>
      </g>}
      {topic === "Finance" && <g transform="translate(130 80)">
        {[0,1,2,3].map((n) => <g key={n} transform={`translate(${n*95} ${180-n*40})`}><path d="M0 0l42-24 52 24-42 24Z" className="art-light"/><path d={`M0 0v${80+n*40}l52 24V24Z`} className="art-mid"/><path d={`M52 24l42-24v${80+n*40}l-42 24Z`} className="art-dark"/></g>)}
        <path d="M0 138L110 96 210 120 330 20" className="art-line" fill="none" strokeWidth="8" strokeLinecap="round"/><path d="M287 20h43v43" className="art-line" fill="none" strokeWidth="8"/>
      </g>}
      {topic === "Science" && <g transform="translate(320 210)">
        {[0,60,120].map((r) => <ellipse key={r} rx="180" ry="64" transform={`rotate(${r})`} className="art-line" fill="none" strokeWidth="4"/>)}
        <circle r="56" fill={`url(#${id}-metal)`}/><circle cx="165" cy="25" r="18" className="art-light"/><circle cx="-98" cy="-138" r="13" className="art-light"/>
        <path d="M-250 155Q0 100 250 155" className="art-line" fill="none" opacity=".3"/>
      </g>}
      {topic === "Business" && <g transform="translate(120 65)">
        {[0,1,2,3,4].map((n) => <g key={n} transform={`translate(${n*78} ${n%2*40})`}><path d="M0 100l34-20 44 20v205l-34 20L0 305Z" fill={`url(#${id}-metal)`}/><path d="M34 120v205l44-20V100Z" className="art-dark"/>{[0,1,2,3].map((w) => <path key={w} d={`M8 ${132+w*38}l17 9v16l-17-9Z`} className="art-light"/>)}</g>)}
        <path d="M-50 342l470-30" className="art-line" strokeWidth="3"/>
      </g>}
    </svg>
  </div>;
}
