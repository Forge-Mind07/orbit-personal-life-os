import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Info, Share2 } from "lucide-react";
import { toast } from "sonner";
import { getArticle, cityize } from "@/lib/orbit/feed";
import { useOrbit } from "@/lib/orbit/store";
import { EditorialArt } from "@/components/orbit/feed/EditorialArt";
import { BookmarkButton } from "@/components/orbit/feed/BookmarkButton";
import { Button } from "@/components/ui/button";
import "@/components/orbit/feed/feed.css";

export const Route = createFileRoute("/article/$id")({
  loader: ({params}) => { const a = getArticle(params.id); if (!a) throw notFound(); return {title:cityize(a.title,"Chennai"),dek:a.dek}; },
  head: ({loaderData}) => ({meta: [
    {title:loaderData ? `${loaderData.title} · ORBIT Reader` : "Article unavailable · ORBIT"},
    {name:"description",content:loaderData?.dek ?? "Illustrative demo article"},
    {property:"og:title",content:loaderData?.title ?? "ORBIT Reader"},
    {property:"og:description",content:loaderData?.dek ?? "Illustrative demo article"},
    {property:"og:type",content:"article"},{name:"twitter:card",content:"summary_large_image"},
  ]}),
  notFoundComponent: () => <div className="orbit-feed feed-empty"><p>Article not found</p><Link to="/feed" className="feed-reader-return">Back to Feed</Link></div>, component:Reader,
});
function Reader() {
  const {id} = Route.useParams(); const {state} = useOrbit(); const a = getArticle(id);
  if (!a) return null;
  const c = (text:string) => cityize(text,state.city);
  const share = async () => {
    const data = {title:c(a.title),text:`Illustrative ORBIT demo article: ${c(a.dek)}`,url:window.location.href};
    try { if (navigator.share) {await navigator.share(data);return;} } catch (error) {if (error instanceof Error && error.name === "AbortError") return;}
    try {await navigator.clipboard.writeText(data.url);toast("Article link copied");} catch {toast("Sharing unavailable — copy the address from your browser");}
  };
  return <div className="orbit-feed feed-reader"><div className="feed-reader-column">
    <header className="feed-reader-hero"><EditorialArt topic={a.topic}/><div className="feed-media-shade"/><Link to="/feed" className="feed-reader-back" aria-label="Back to Feed"><ArrowLeft size={20}/></Link>
      <div className="feed-reader-caption"><div className="feed-reader-tags"><span>{a.topic}</span><span>{a.scope === "City" ? state.city : a.scope}</span><span>Illustrative demo article</span></div><h1>{c(a.title)}</h1><p>{c(a.dek)}</p>
        <div className="feed-reader-source"><span className="feed-source-avatar" aria-hidden="true">O</span><div className="feed-source-text">ORBIT Demo Desk<small>{a.readMin} min read · fictional example</small></div><BookmarkButton id={a.id}/><Button variant="ghost" className="feed-icon-button" aria-label="Share article" onClick={share}><Share2/></Button></div>
      </div>
    </header>
    <div className="feed-reader-body"><aside className="feed-reader-summary"><h2>The short version</h2><ul>{a.keyPoints.map((point) => <li key={point}>{c(point)}</li>)}</ul></aside>
      <article>{a.body.map((p,i) => <p key={i}>{c(p)}</p>)}</article>
      <div className="feed-source-note"><Info/><p>Source: ORBIT Demo Desk (synthetic). This article and its artwork are original illustrations for the prototype, not reporting of real events. No external source is claimed.</p></div>
      <Link to="/feed" className="feed-reader-return">Back to your reading world <ArrowUpRight size={16}/></Link>
    </div>
  </div></div>;
}
