import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bookmark, Search, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/orbit/feed/BookmarkButton";
import { DailyBriefing } from "@/components/orbit/feed/DailyBriefing";
import { EditorialArt } from "@/components/orbit/feed/EditorialArt";
import { StoryCarousel } from "@/components/orbit/feed/StoryCarousel";
import { useOrbit } from "@/lib/orbit/store";
import { TOPICS, cityize, filterArticles, searchArticles, type Scope, type Topic } from "@/lib/orbit/feed";
import "@/components/orbit/feed/feed.css";

export const Route = createFileRoute("/feed")({
  head: () => ({ meta: [
    { title: "Your reading world · ORBIT Feed" },
    { name: "description", content: "Your personal editorial feed with source-grounded demo briefings, saved stories and illustrative articles." },
    { property: "og:title", content: "Your reading world · ORBIT Feed" },
    { property: "og:description", content: "Explore fictional city, national and world stories and a personalized demo briefing." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Feed,
});
const SCOPES: Scope[] = ["City", "National", "International"];
type TopicFilter = Topic | "For You" | "Saved";
function Feed() {
  const { state } = useOrbit();
  const [scope, setScope] = useState<Scope>("City");
  const [topic, setTopic] = useState<TopicFilter>("For You");
  const [search, setSearch] = useState("");
  const [greeting, setGreeting] = useState("Good morning");
  const reduce = useReducedMotion();
  useEffect(() => { const h = new Date().getHours(); setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"); }, []);
  const list = searchArticles(filterArticles(scope, topic, state.topics, state.bookmarks), search, state.city);
  return <div className="orbit-feed"><div className="feed-page">
    <DailyBriefing scope={scope}/>
    <div className="feed-search"><Search/><input type="search" aria-label="Search stories" placeholder="Search your reading world" value={search} onChange={(e) => setSearch(e.target.value)}/>{search && <Button variant="ghost" className="feed-icon-button" aria-label="Clear search" onClick={() => setSearch("")}><X/></Button>}</div>
    <header className="feed-greeting"><h2>{greeting}, {state.name}.</h2><p>A fresh perspective, one story at a time.</p></header>
    <div className="feed-filters">
      <div className="feed-pills" role="group" aria-label="News scope">{SCOPES.map((s) => <Button variant="ghost" className="feed-pill" key={s} aria-pressed={scope === s} onClick={() => {setScope(s); if (topic === "Saved") setTopic("For You");}}>{s === "City" ? state.city : s}</Button>)}</div>
      <div className="feed-pills" role="group" aria-label="Topics">{(["For You", ...TOPICS, "Saved"] as TopicFilter[]).map((t) => <Button variant="ghost" key={t} className="feed-pill" aria-pressed={topic === t} onClick={() => setTopic(t)}>{t === "Saved" && <Bookmark size={12}/>} {t}{t === "Saved" && state.bookmarks.length > 0 ? ` · ${state.bookmarks.length}` : ""}</Button>)}</div>
    </div>
    {list.length ? <div className="feed-layout">
      <div><div className="feed-section-title"><h2>In the spotlight</h2><span>{topic === "Saved" ? "Your collection" : scope === "City" ? state.city : scope}</span></div><StoryCarousel articles={list.slice(0,5)} city={state.city}/>
        <div className="feed-section-title"><div><h2>Walk with Trend</h2><p>Ideas worth a closer look.</p></div></div><StoryCarousel portrait articles={list.slice(0,6)} city={state.city}/>
      </div>
      <div><div className="feed-section-title"><h2>{topic === "Saved" ? "Saved for a quiet moment" : "Top reads of the day"}</h2><span>{list.length} stories</span></div>
        <div className="feed-rows">{list.map((a,i) => <motion.div className="feed-row" key={a.id} initial={reduce ? false : {opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:reduce ? 0 : .24,delay:reduce ? 0 : Math.min(i,4)*.035}}>
          <Link to="/article/$id" params={{id:a.id}} className="feed-row-link"><EditorialArt topic={a.topic}/><div className="feed-row-text"><p className="feed-row-label">{a.topic} · Illustrative demo article</p><h3>{cityize(a.title,state.city)}</h3><p>{a.readMin} min read · {a.hoursAgo}h ago in demo</p></div></Link><BookmarkButton id={a.id}/>
        </motion.div>)}</div>
      </div>
    </div> : <div className="feed-empty"><Bookmark/><p>{topic === "Saved" ? "No saved stories here yet" : "No stories match this view"}</p><p>{search ? "Try a different search or clear your filters." : "Choose another topic, or save a story for later."}</p></div>}
    <p className="feed-footnote">Fictional stories, original illustrative artwork. ORBIT Demo Desk · not live news.</p>
  </div></div>;
}
