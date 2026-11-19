import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cityize, type Article } from "@/lib/orbit/feed";
import { EditorialArt } from "./EditorialArt";

export function StoryCarousel({ articles, city, portrait = false }: { articles: Article[]; city: string; portrait?: boolean }) {
  const [ref, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [selected, setSelected] = useState(0);
  const onSelect = useCallback(() => setSelected(api?.selectedScrollSnap() ?? 0), [api]);
  useEffect(() => { if (!api) return; onSelect(); api.on("select", onSelect); api.on("reInit", onSelect); return () => { api.off("select", onSelect); api.off("reInit", onSelect); }; }, [api, onSelect]);
  return <div className={portrait ? "feed-carousel feed-carousel-portrait" : "feed-carousel"} role="region" aria-label={portrait ? "Trending stories" : "Featured stories"} aria-roledescription="carousel">
    <div ref={ref} className="feed-carousel-viewport"><div className="feed-carousel-track">
      {articles.map((a) => <Link key={a.id} to="/article/$id" params={{id:a.id}} className="feed-feature" aria-label={cityize(a.title, city)}>
        <EditorialArt topic={a.topic}/><div className="feed-media-shade"/><span className="feed-illustrative">Illustrative</span>
        <div className="feed-feature-caption"><span className="feed-media-topic">{a.topic}</span><h3>{cityize(a.title, city)}</h3>{!portrait && <p>{a.readMin} min read <span>·</span> ORBIT Demo Desk <ArrowUpRight size={16}/></p>}</div>
      </Link>)}
    </div></div>
    {!portrait && articles.length > 1 && <div className="feed-carousel-controls"><div className="feed-dots">{articles.map((a,i) => <Button variant="ghost" key={a.id} aria-label={`Show featured story ${i+1}`} aria-pressed={selected === i} onClick={() => api?.scrollTo(i)} className={selected === i ? "feed-dot is-active" : "feed-dot"}><span/></Button>)}</div><div><Button variant="ghost" className="feed-icon-button" aria-label="Previous featured story" onClick={() => api?.scrollPrev()} disabled={!api?.canScrollPrev()}><ArrowLeft/></Button><Button variant="ghost" className="feed-icon-button" aria-label="Next featured story" onClick={() => api?.scrollNext()} disabled={!api?.canScrollNext()}><ArrowRight/></Button></div></div>}
  </div>;
}
