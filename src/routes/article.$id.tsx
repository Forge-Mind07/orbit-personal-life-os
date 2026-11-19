import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { getArticle, cityize } from "@/lib/orbit/feed";
import { useOrbit } from "@/lib/orbit/store";
import { ArticleThumb } from "@/components/orbit/common/ArticleThumb";
import { Page } from "@/components/orbit/common/bits";
import { BookmarkButton } from "@/components/orbit/feed/BookmarkButton";

export const Route = createFileRoute("/article/$id")({
  loader: ({ params }) => {
    const a = getArticle(params.id);
    if (!a) throw notFound();
    return { title: a.title.split("{city}").join("Chennai"), dek: a.dek };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} · ORBIT Reader` : "Article unavailable · ORBIT" },
      { name: "description", content: loaderData?.dek ?? "Illustrative demo article" },
      { property: "og:title", content: loaderData?.title ?? "ORBIT Reader" },
      { property: "og:description", content: loaderData?.dek ?? "Illustrative demo article" },
      { property: "og:type", content: "article" },
    ],
  }),
  notFoundComponent: () => (
    <Page className="pt-10 text-center"><p className="font-semibold">Article not found</p><Link to="/feed" className="mt-3 inline-block text-primary">Back to Feed</Link></Page>
  ),
  component: Reader,
});

function Reader() {
  const { id } = Route.useParams();
  const { state } = useOrbit();
  const a = getArticle(id)!;
  const c = (s: string) => cityize(s, state.city);
  return (
    <Page className="max-w-2xl pt-4">
      <ArticleThumb hues={a.hues} className="h-52 rounded-[28px] sm:h-72" />
      <div className="mt-5 flex items-center gap-2">
        <span className="rounded-full border border-feed/40 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-feed">Illustrative demo article</span>
        <span className="text-xs text-muted-foreground">{a.scope} · {a.topic}</span>
        <div className="ml-auto"><BookmarkButton id={a.id} /></div>
      </div>
      <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight">{c(a.title)}</h2>
      <p className="mt-3 text-lg text-muted-foreground">{c(a.dek)}</p>
      <p className="mt-4 text-sm text-muted-foreground">By <span className="font-semibold text-foreground">Orbit Demo Desk</span> · {a.readMin} min read</p>
      <aside className="card-orbit mt-6 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</p>
        <ul className="mt-3 space-y-2">
          {a.keyPoints.map((k) => <li key={k} className="flex gap-3 text-sm"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-feed" />{k}</li>)}
        </ul>
      </aside>
      <article className="mt-6 space-y-5 text-[17px] leading-8">
        {a.body.map((p, i) => <p key={i}>{c(p)}</p>)}
      </article>
      <div className="mt-8 flex gap-3 rounded-2xl bg-surface-2/60 p-4 text-sm text-muted-foreground">
        <Info className="size-5 shrink-0" />
        <p>Source attribution: Orbit Demo Desk (synthetic). This article was written for the prototype and does not report real events. No external link is provided.</p>
      </div>
    </Page>
  );
}
