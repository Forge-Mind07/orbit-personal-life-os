export type Scope = "City" | "National" | "International";
export type Topic = "AI" | "Technology" | "Finance" | "Science" | "Business";
export const TOPICS: Topic[] = ["AI", "Technology", "Finance", "Science", "Business"];
export const CITIES = ["Chennai", "Bengaluru", "Hyderabad", "Kochi", "Mumbai", "Delhi"];

export interface Article {
  id: string;
  scope: Scope;
  topic: Topic;
  /** `{city}` is replaced with the user's chosen city */
  title: string;
  dek: string;
  keyPoints: string[];
  body: string[];
  readMin: number;
  hoursAgo: number;
  /** two oklch hues used for the abstract thumbnail */
  hues: [number, number];
}

export const ARTICLES: Article[] = [
  {
    id: "city-metro-ai",
    scope: "City",
    topic: "AI",
    title: "How {city}'s transit planners might use AI to predict rush-hour crowding",
    dek: "A thought experiment on station-level forecasting, and the privacy questions that come with it.",
    keyPoints: ["Forecasts could use anonymised ticket taps, not personal data", "Signage might nudge riders toward quieter coaches", "Public audits would matter as much as accuracy"],
    body: [
      "Imagine a commuter opening a transit app in {city} at 8:40 a.m. and seeing that the third coach of the next train is likely to be half-empty. That is the promise of crowd forecasting: small, practical nudges rather than sweeping automation.",
      "Models of this kind typically learn from aggregate patterns such as ticket taps, train timings and weather. The hard part is less the maths than the governance: who can see the data, how long it is kept, and how riders can question decisions made on their behalf.",
      "This illustrative piece is written for Orbit's demo and does not describe a real announcement.",
    ],
    readMin: 4,
    hoursAgo: 2,
    hues: [255, 293],
  },
  {
    id: "city-startup",
    scope: "City",
    topic: "Business",
    title: "Inside a fictional {city} co-working floor where hardware startups share one lab",
    dek: "Shared tooling lowers the cost of a first prototype. A composite portrait.",
    keyPoints: ["Shared 3D printers and test benches cut early costs", "Founders trade hours of expertise instead of cash", "The model works best with clear booking rules"],
    body: [
      "On a composite co-working floor in {city}, five early-stage hardware teams split the cost of a single electronics lab. One builds water sensors, another a low-cost prosthetic grip.",
      "The arrangement is a reminder that infrastructure, not just funding, decides how fast ideas reach a working prototype.",
      "This is an illustrative demo article, not reporting on real companies.",
    ],
    readMin: 5,
    hoursAgo: 5,
    hues: [80, 20],
  },
  {
    id: "city-heat",
    scope: "City",
    topic: "Science",
    title: "Why evening walks feel easier in coastal cities like {city}",
    dek: "Sea breezes, humidity and the science of perceived temperature, explained simply.",
    keyPoints: ["Sea breezes usually strengthen through the afternoon", "Humidity affects how hot it feels more than the thermometer", "Shade and timing change perceived effort"],
    body: [
      "If your evening walk along the coast feels easier than a noon errand, there's a reason. Land heats faster than water, and the pressure difference pulls cooler air inland as the day goes on.",
      "Perceived temperature blends heat, humidity and wind. A breeze helps sweat evaporate, which is the body's main cooling system.",
      "Written as an illustrative explainer for Orbit's demo feed.",
    ],
    readMin: 3,
    hoursAgo: 8,
    hues: [165, 200],
  },
  {
    id: "city-upi",
    scope: "City",
    topic: "Finance",
    title: "Small merchants in {city} and the quiet shift to QR-first payments",
    dek: "A composite look at how a tea stall's books change when nearly every sale is digital.",
    keyPoints: ["Digital receipts make daily totals easier to track", "Settlement timing still matters for cash flow", "Many keep a small cash float for change"],
    body: [
      "For a composite tea-stall owner in {city}, the change is less about technology and more about bookkeeping: every sale now leaves a trail.",
      "That trail can help with loans and planning, but only if the merchant has simple tools to read it.",
      "Illustrative demo article. Names and scenarios are fictional.",
    ],
    readMin: 4,
    hoursAgo: 11,
    hues: [80, 165],
  },
  {
    id: "nat-chips",
    scope: "National",
    topic: "Technology",
    title: "What it would take to design more chips in India: an explainer",
    dek: "Design, fabrication and packaging are different businesses. Here's the map.",
    keyPoints: ["Chip design is talent-heavy and capital-light", "Fabrication needs enormous, long-term investment", "Packaging and testing are a common first step"],
    body: [
      "People often talk about 'making chips' as one activity. In practice, it is a chain: architecture and design, fabrication in a fab, then packaging and testing.",
      "Each link has very different economics, which is why countries often specialise.",
      "This is an illustrative explainer for the Orbit demo and makes no claims about current policy.",
    ],
    readMin: 6,
    hoursAgo: 3,
    hues: [293, 255],
  },
  {
    id: "nat-sip",
    scope: "National",
    topic: "Finance",
    title: "The case for boring investing: a primer on systematic plans",
    dek: "Why consistency often matters more than timing, explained without jargon.",
    keyPoints: ["Regular investing smooths out entry prices", "Costs and fees compound too", "Matching horizon to goal reduces stress"],
    body: [
      "A systematic plan invests a fixed amount on a schedule. Its main benefit is behavioural: it removes the urge to guess the perfect moment.",
      "Over long horizons, the steady habit usually matters more than the specific day you start.",
      "General education only. Illustrative demo article, not financial advice.",
    ],
    readMin: 5,
    hoursAgo: 6,
    hues: [80, 50],
  },
  {
    id: "nat-lang-ai",
    scope: "National",
    topic: "AI",
    title: "Why AI models that understand Indian languages are harder to build",
    dek: "Data scarcity, code-mixing and script diversity, unpacked.",
    keyPoints: ["Many languages have little digitised text", "People mix languages mid-sentence", "Evaluation needs native-speaker review"],
    body: [
      "Most large language models learn from text on the web, which is unevenly distributed across languages. Tamil, Telugu or Odia have rich literatures but far less digitised, labelled data.",
      "Code-mixing, such as Tanglish, adds another layer: models must handle two vocabularies and scripts in a single message.",
      "Illustrative demo article for the Orbit prototype.",
    ],
    readMin: 5,
    hoursAgo: 9,
    hues: [293, 165],
  },
  {
    id: "nat-d2c",
    scope: "National",
    topic: "Business",
    title: "Direct-to-consumer brands and the economics of the second order",
    dek: "Acquisition is expensive. Retention is where the business is decided.",
    keyPoints: ["First orders rarely cover marketing costs", "Repeat purchase rate is the key metric", "Packaging and delivery shape loyalty"],
    body: [
      "For many online-first brands, the first sale loses money once ad spend is counted. Profit arrives, if at all, on the second and third orders.",
      "That shifts attention from flashy campaigns to product quality and service.",
      "Illustrative demo article.",
    ],
    readMin: 4,
    hoursAgo: 14,
    hues: [20, 340],
  },
  {
    id: "intl-fusion",
    scope: "International",
    topic: "Science",
    title: "Fusion energy, explained: why 'net gain' is only the first milestone",
    dek: "From lab experiments to power plants, the hard parts are engineering.",
    keyPoints: ["Scientific gain differs from plant-level gain", "Materials must survive intense neutron flux", "Timelines depend on engineering, not physics alone"],
    body: [
      "When researchers talk about 'gain' in fusion, they often mean the energy released compared to the energy delivered to the fuel, not the electricity a plant could sell.",
      "Bridging that gap requires durable materials, efficient lasers or magnets, and reliable operations.",
      "Illustrative demo explainer, not coverage of a specific event.",
    ],
    readMin: 7,
    hoursAgo: 4,
    hues: [200, 255],
  },
  {
    id: "intl-agents",
    scope: "International",
    topic: "AI",
    title: "Personal AI agents: what 'acting on your behalf' should and shouldn't mean",
    dek: "Permissions, undo buttons and audit trails, a design checklist.",
    keyPoints: ["Agents should ask before irreversible actions", "Every action needs a readable log", "Local-first designs can limit data exposure"],
    body: [
      "An assistant that can book, buy or send on your behalf is only as trustworthy as its guardrails. Good designs make permissions explicit and actions reversible.",
      "Local agents, running on a laptop you control, can keep sensitive files off remote servers, but they still need clear consent flows.",
      "Illustrative demo article for Orbit.",
    ],
    readMin: 6,
    hoursAgo: 1,
    hues: [293, 320],
  },
  {
    id: "intl-rates",
    scope: "International",
    topic: "Finance",
    title: "How interest rates ripple from central banks to your EMI",
    dek: "A plain-language chain from policy rate to monthly payment.",
    keyPoints: ["Policy rates influence bank funding costs", "Floating loans adjust with a lag", "Fixed deposits often move in the same direction"],
    body: [
      "When a central bank changes its policy rate, banks' borrowing costs shift. Over weeks or months, that flows through to loans and deposits.",
      "For a floating-rate home loan, the change usually appears as a different EMI or tenure.",
      "General education. Illustrative demo article.",
    ],
    readMin: 5,
    hoursAgo: 7,
    hues: [80, 293],
  },
  {
    id: "intl-batteries",
    scope: "International",
    topic: "Technology",
    title: "Beyond lithium: a field guide to the next generation of batteries",
    dek: "Sodium-ion, solid-state and iron-air, what each might be good for.",
    keyPoints: ["Sodium-ion trades energy density for cost", "Solid-state aims for safety and range", "Iron-air targets long-duration grid storage"],
    body: [
      "No single chemistry wins everywhere. Phones need density, grids need cheap long-duration storage, and scooters need a balance of both.",
      "Expect a portfolio of batteries, each matched to a job.",
      "Illustrative demo explainer.",
    ],
    readMin: 6,
    hoursAgo: 12,
    hues: [165, 80],
  },
  {
    id: "intl-4day",
    scope: "International",
    topic: "Business",
    title: "What four-day-week trials actually measure",
    dek: "Output, wellbeing and retention, and why the design of a trial matters.",
    keyPoints: ["Trials often track wellbeing and retention", "Self-selection can bias results", "Roles with fixed coverage are harder to adapt"],
    body: [
      "Shorter-week experiments usually measure more than productivity: burnout, sick days and staff turnover are central.",
      "Because companies volunteer to take part, results may not generalise to every workplace.",
      "Illustrative demo article.",
    ],
    readMin: 4,
    hoursAgo: 16,
    hues: [255, 200],
  },
];

export const cityize = (s: string, city: string) => s.split("{city}").join(city);
export const getArticle = (id: string) => ARTICLES.find((a) => a.id === id);

export function filterArticles(scope: Scope, topic: Topic | "For You" | "Saved", prefs: Topic[], bookmarks: string[]) {
  return ARTICLES.filter((a) => {
    if (topic === "Saved") return bookmarks.includes(a.id);
    if (a.scope !== scope) return false;
    if (topic === "For You") return prefs.length === 0 || prefs.includes(a.topic);
    return a.topic === topic;
  }).sort((a, b) => a.hoursAgo - b.hoursAgo);
}

export function briefingFor(prefs: Topic[]) {
  const pool = ARTICLES.filter((a) => prefs.length === 0 || prefs.includes(a.topic)).sort((a, b) => a.hoursAgo - b.hoursAgo);
  const out: Article[] = [];
  for (const s of ["City", "National", "International"] as Scope[]) {
    const a = pool.find((x) => x.scope === s);
    if (a) out.push(a);
  }
  return out;
}

/** Search is local and uses only the fictional article text. */
export function searchArticles(articles: Article[], query: string, city: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return articles.filter((a) => words.every((word) => cityize(`${a.title} ${a.dek}`, city).toLocaleLowerCase().includes(word)));
}

/** Recompose grounded takeaways without inventing reporting or calling a model. */
export function demoBriefing(scope: Scope, prefs: Topic[], revision = 0) {
  const pool = filterArticles(scope, "For You", prefs, []);
  return pool.slice(0, 5).map((article) => ({
    article,
    takeaway: article.keyPoints[revision % article.keyPoints.length] ?? article.dek,
  }));
}
