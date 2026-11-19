import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Newspaper } from "lucide-react";
import { BookmarkButton } from "@/components/orbit/feed/BookmarkButton";
import { useOrbit } from "@/lib/orbit/store";
import { ARTICLES, TOPICS, briefingFor, cityize, filterArticles, type Article, type Scope, type Topic } from "@/lib/orbit/feed";
import { Chip, Page, SectionHeader } from "@/components/orbit/common/bits";
import { SegmentTabs } from "@/components/orbit/common/SegmentTabs";
import { ArticleThumb } from "@/components/orbit/common/ArticleThumb";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Feed · ORBIT" },
      { name: "description", content: "A calm, editorial reading feed by city, nation and world. Illustrative demo articles." },
      { property: "og:title", content: "Feed · ORBIT" },
      { property: "og:description", content: "A calm, editorial reading feed by city, nation and world." },
    ],
  }),
  component: Feed,
});

const SCOPES = ["City", "National", "International"] as const;
type TopicFilter = Topic | "For You" | "Saved";

function Row({ a, city, i }: { a: Article; city: string; i: number }) {
  return (
    <Link to="/article/$id" params={{ id: a.id }} className="flex gap-4 py-4">
      <ArticleThumb hues={a.hues} seed={i} className="size-20 shrink-0 rounded-2xl" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-feed">{a.topic} · Illustrative demo article</p>
        <p className="mt-1 line-clamp-2 font-semibold leading-snug">{cityize(a.title, city)}</p>
        <p className="mt-1 text-xs text-muted-foreground">{a.readMin} min · Orbit Demo Desk</p>
      </div>
      <BookmarkButton id={a.id} />
    </Link>
  );
}

function Feed() {
  const { state } = useOrbit();
  const [scope, setScope] = useState<Scope>("City");
  const [topic, setTopic] = useState<TopicFilter>("For You");
  const list = filterArticles(scope, topic, state.topics, state.bookmarks);
  const brief = briefingFor(state.topics);
  const [lead, ...rest] = list;

  return (
    <Page className="space-y-6 pt-6">
      <section className="card-orbit relative overflow-hidden p-6">
        <p className="relative flex items-center gap-2 text-sm font-semibold text-feed"><Newspaper className="size-4" /> Daily briefing</p>
        <p className="relative mt-2 font-display text-2xl font-bold tracking-tight">Three things worth your attention</p>
        <ol className="relative mt-4 space-y-3">
          {brief.map((a, i) => (
            <li key={a.id}>
              <Link to="/article/$id" params={{ id: a.id }} className="flex gap-3 text-sm">
                <span className="font-display font-bold text-feed tnum">0{i + 1}</span>
                <span><span className="font-semibold">{cityize(a.title, state.city)}</span> <span className="text-muted-foreground">· {a.scope}</span></span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="relative mt-4 text-xs text-muted-foreground">Illustrative demo content generated for this prototype, not real current news.</p>
      </section>

      <SegmentTabs id="scope" label="News scope" options={SCOPES} value={scope} onChange={(s) => { setScope(s); if (topic === "Saved") setTopic("For You"); }} />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Topics">
        {(["For You", ...TOPICS, "Saved"] as TopicFilter[]).map((t) => (
          <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>{t}{t === "Saved" && state.bookmarks.length > 0 ? ` · ${state.bookmarks.length}` : ""}</Chip>
        ))}
      </div>

      {!lead ? (
        <div className="card-orbit flex flex-col items-center p-10 text-center">
          <Bookmark className="size-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">{topic === "Saved" ? "Nothing saved yet" : "No stories here"}</p>
          <p className="mt-1 text-sm text-muted-foreground">{topic === "Saved" ? "Tap the bookmark on any article to keep it here." : "Try another topic or scope."}</p>
        </div>
      ) : (
        <section>
          <SectionHeader title={topic === "Saved" ? "Saved" : scope === "City" ? state.city : scope} eyebrow={`${list.length} stories`} />
          <Link to="/article/$id" params={{ id: lead.id }} className="card-orbit block overflow-hidden">
            <ArticleThumb hues={lead.hues} className="h-44 sm:h-56" />
            <div className="p-5">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-feed">{lead.topic} · Illustrative demo article</p>
                  <h3 className="mt-2 font-display text-xl font-bold leading-snug tracking-tight">{cityize(lead.title, state.city)}</h3>
                </div>
                <BookmarkButton id={lead.id} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{cityize(lead.dek, state.city)}</p>
              <p className="mt-3 text-xs text-muted-foreground">{lead.readMin} min read · Orbit Demo Desk</p>
            </div>
          </Link>
          {rest.length > 0 && <div className="card-orbit mt-3 divide-y px-5">{rest.map((a, i) => <Row key={a.id} a={a} city={state.city} i={i + 1} />)}</div>}
        </section>
      )}
      <p className="sr-only">{ARTICLES.length} demo articles available</p>
    </Page>
  );
}
