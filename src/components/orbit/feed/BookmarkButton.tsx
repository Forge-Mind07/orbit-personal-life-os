import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useOrbit } from "@/lib/orbit/store";

export function BookmarkButton({ id }: { id: string }) {
  const { state, toggleBookmark } = useOrbit();
  const on = state.bookmarks.includes(id);
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); const now = toggleBookmark(id); toast(now ? "Saved for later" : "Removed from saved"); }}
      aria-pressed={on}
      aria-label={on ? "Remove bookmark" : "Save article"}
      className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
    >
      {on ? <BookmarkCheck className="size-5 text-feed" /> : <Bookmark className="size-5" />}
    </button>
  );
}

