import { useState } from "react";
import { Play, Pause, ArrowUpRight, Orbit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthSheet } from "./HealthSheet";

export function StartActivity({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [started, setStarted] = useState(false);
  return <HealthSheet open={open} onOpenChange={onOpenChange} title="A little movement. A fresh start." description="Activity preview · no GPS, sensors or workout recording.">
    <div className="health-intro">
      <p className="flex items-center gap-2 text-xs font-bold"><Orbit className="size-4" /> ORBIT / MOVEMENT</p>
      <h2 className="health-intro-title">Start<br />your<br />stride.</h2>
      <svg className={`health-runner ${started ? "is-running" : ""}`} viewBox="0 0 340 330" role="img" aria-label="Original illustration of a runner in an apricot jacket and mint trousers">
        <path className="runner-trail" d="M10 292C70 215 188 339 314 242" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" />
        <ellipse cx="185" cy="297" rx="80" ry="12" fill="var(--runner-shadow)" />
        <g className="runner-body" strokeLinejoin="round" strokeLinecap="round">
          <path d="M165 183L126 235L64 223" stroke="var(--runner-mint)" strokeWidth="30" fill="none" />
          <path d="M191 184L227 224L203 275" stroke="var(--runner-mint)" strokeWidth="30" fill="none" />
          <path d="M62 214L50 230L83 242" stroke="var(--runner-yellow)" strokeWidth="17" fill="none" />
          <path d="M200 274L199 290L231 290" stroke="var(--runner-yellow)" strokeWidth="17" fill="none" />
          <path d="M175 104L163 154L181 191" stroke="var(--runner-warm)" strokeWidth="57" fill="none" />
          <path d="M168 117L127 142L103 122M190 115L218 141L249 114" stroke="var(--runner-warm)" strokeWidth="23" fill="none" />
          <path d="M102 122L93 117M249 114L260 103" stroke="var(--runner-skin)" strokeWidth="17" />
          <path d="M182 102L187 82" stroke="var(--runner-skin)" strokeWidth="20" />
          <ellipse cx="191" cy="66" rx="24" ry="29" fill="var(--runner-skin)" transform="rotate(16 191 66)" />
          <path d="M165 58Q168 24 199 34Q224 41 215 59Z" fill="var(--primary)" />
          <path d="M209 58L231 65" stroke="var(--primary)" strokeWidth="10" />
          <path d="M186 66L211 72" stroke="var(--foreground)" strokeWidth="11" />
          <path d="M159 144L190 153" stroke="var(--runner-seam)" strokeWidth="2" />
        </g>
      </svg>
      <div className="health-intro-caption"><span>YOUR PACE.<br />YOUR POSSIBILITY.</span><ArrowUpRight className="size-6" /></div>
    </div>
    <Button className="mt-4 w-full" onClick={() => setStarted((s) => !s)}>{started ? <Pause /> : <Play />}{started ? "Pause preview" : "Start activity preview"}</Button>
    <p className="mt-3 text-center text-xs text-muted-foreground">{started ? "Enjoy your stride. Your demo totals remain unchanged." : "A moment of motivation, whenever you need it."}</p>
  </HealthSheet>;
}