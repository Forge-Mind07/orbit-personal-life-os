import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronDown, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoBriefing, cityize, type Scope } from "@/lib/orbit/feed";
import { useOrbit } from "@/lib/orbit/store";

export function DailyBriefing({ scope }: { scope: Scope }) {
  const { state, today } = useOrbit();
  const [expanded, setExpanded] = useState(false);
  const [revision, setRevision] = useState(0);
  const reduce = useReducedMotion();
  const items = demoBriefing(scope, state.topics, revision);
  const date = new Date(`${today}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return <section className="feed-briefing" aria-labelledby="briefing-title">
    <div className="feed-briefing-top"><span><Sparkles size={15}/> Your AI Daily Briefing</span><time dateTime={today}>{date}</time></div>
    <h1 id="briefing-title">The world, in 60 seconds.</h1>
    <p className="feed-briefing-intro">A little perspective on {items.length ? items.map(({article}) => article.topic.toLowerCase()).filter((t,i,a) => a.indexOf(t) === i).join(", ") : "your interests"}.</p>
    <p className="feed-demo-label">Demo briefing · example articles</p>
    <AnimatePresence initial={false}>
      {expanded && <motion.div id="briefing-stories" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : .24 }} className="feed-briefing-expanded">
        {items.length === 0 ? <p>No example articles for your followed topics in this region.</p> : items.map(({article, takeaway}, i) => <div className="feed-takeaway" key={article.id}><span className="feed-takeaway-number">0{i+1}</span><div><p>{cityize(takeaway, state.city)}</p><Link to="/article/$id" params={{id:article.id}}>{cityize(article.title, state.city)}<ArrowUpRight size={14}/></Link></div></div>)}
        <p className="feed-ai-note">AI generation coming with live sources. These takeaways are composed from fictional ORBIT articles, not a live AI model.</p>
      </motion.div>}
    </AnimatePresence>
    <div className="feed-briefing-footer"><span className="feed-briefing-scope">{scope === "City" ? state.city : scope === "International" ? "World" : "National"} · {items.length} sources</span><div><Button variant="ghost" className="feed-icon-button" title="Recompose demo briefing" aria-label="Refresh demo briefing" onClick={() => setRevision((r) => r+1)}><RefreshCw key={revision} className={revision && !reduce ? "feed-refresh" : ""}/></Button><Button variant="ghost" className="feed-briefing-expand" aria-expanded={expanded} aria-controls="briefing-stories" onClick={() => setExpanded((v) => !v)}>{expanded ? "Less" : "Read briefing"}<ChevronDown className={expanded ? "feed-chevron-up" : ""}/></Button></div></div>
    <span className="sr-only" role="status">{revision ? `Demo briefing recomposed ${revision} times` : ""}</span>
  </section>;
}
