import { describe, expect, it } from "vitest";
import { ARTICLES, demoBriefing, filterArticles, searchArticles } from "@/lib/orbit/feed";

describe("Feed local rules", () => {
  it("searches personalized titles and deks", () => {
    expect(searchArticles(ARTICLES, "Chennai transit", "Chennai").map(a => a.id)).toEqual(["city-metro-ai"]);
    expect(searchArticles(ARTICLES, "not-a-real-story", "Chennai")).toEqual([]);
  });
  it("grounds all briefing takeaways in actual key points", () => {
    const items = demoBriefing("City", ["AI"], 0);
    expect(items.map(x => x.article.id)).toEqual(["city-metro-ai"]);
    expect(items[0]?.takeaway).toBe("Forecasts could use anonymised ticket taps, not personal data");
  });
  it("recomposes deterministically using the next actual key point", () => {
    const items = demoBriefing("City", ["AI"], 1);
    expect(items[0]?.takeaway).toBe("Signage might nudge riders toward quieter coaches");
    expect(items).toEqual(demoBriefing("City", ["AI"], 1));
  });
  it("personalizes the briefing by region and followed topics", () => {
    expect(demoBriefing("International", ["Science"]).map(x => x.article.id)).toEqual(["intl-fusion"]);
  });
  it("keeps saved articles across regions", () => {
    expect(filterArticles("City", "Saved", [], ["intl-fusion"]).map(x => x.id)).toEqual(["intl-fusion"]);
  });
});
