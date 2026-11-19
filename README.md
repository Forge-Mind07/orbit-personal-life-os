# Orbit Personal Life OS

Build a NEW project named "ORBIT — Personal Life OS". This is a real high-fidelity, CLICKABLE mobile-first web app prototype—not a marketing landing page, not a static design mockup, and not yet a native app. Primary target viewport 390x844, responsive at 360–430px, tablet, and desktop. Focus disproportionately on premium visual design, delightful interactions, and internally consistent demo data; do NOT connect any real personal data/services, do NOT require login, backend, or API keys.

PRODUCT VISION
One cohesive personal command center consisting of Home, Health, Finance, Feed, and AI Chat. A slide-out workspace sidebar (inspired by https://www.figma.com/community/file/1116248614926294639/web-app-ui-design ) PLUS a mobile bottom tab bar. Keep navigation consistent and thumb-friendly. On desktop use a persistent sidebar. Home synthesizes the other four modules. Not four disconnected dashboards.

DESIGN DIRECTION
Original bespoke feel, premium and editorial, influenced by Gentler Streak for activity/fitness feedback, Copilot Money for finance visualizations, Readwise Reader for information feed, and clean Slack/Discord navigation hierarchy. Avoid cloning their assets. Dark-first theme, light-mode toggle. Palette: page #0B0D13, surfaces #171B26 and #222738, violet #A78BFA, health mint #65E4B5, finance amber #FFCB70, feed blue #79AFFF, text #F6F7FB, muted #979EAE. Use soft ambient gradients sparingly, layered rounded cards, precise spacing, glass only where useful, refined iconography via lucide-react, bold oversized numbers, polished chart typography, subtle shadows, large accessible touch targets. Use Plus Jakarta Sans and Space Grotesk if possible. No emoji for nav icons. Motion with Framer Motion / Motion when compatible, respect prefers-reduced-motion. Beautiful loading/empty/modal/bottom-sheet states. Chart libraries such as Recharts; render gracefully on small phones. Use React TypeScript, Tailwind, shadcn/ui. Make it feel like a shipping consumer app, NOT default template UI.

GLOBAL
- Top bar with menu button, contextual title, avatar/actions.
- Bottom floating 5-icon navbar (Home, Health, Finance, Feed, Chat), with animated active state and proper safe-area padding.
- Sidebar lists these plus Connections, Notifications, Settings.
- All routes and controls work, including back navigation.
- Demo indicator subtle but unmistakable; data is synthetic and NOT live.
- Persist user's modifications to localStorage (goals, budget, demo expenses, reflections, bookmarks, topic prefs, theme). Add "Reset demo data" in settings.
- Seed a deterministic coherent demo dataset anchored to a fixed historical date for activity charts, rather than random numbers on every render; dates must not confuse users; "today" uses local date with separate sample daily data. Values across widgets and charts must derive from same state (avoid inconsistent amounts).
- Currency INR, location preference Chennai, Tamil Nadu.

HOME
Greeting with date and header. Hero animated step progress ring "7,420 / 10,000 steps", "74% complete", ~5.3km, supportive sentence. Weekly activity indicators tappable to show detail. Mini overview of monthly expenses & portfolio value with sparklines. 2–3 personalized briefing stories previews and shortcut to Feed. A highly polished "Ask Orbit anything" card opens chat. Prioritize generous whitespace and vertical flow; do NOT overload screen.

HEALTH (most polished screen)
- Hero today step count, animated ring, target progress, distance, movement minutes, walking/jogging/running activity-type cards (avoid attributing all steps to workouts).
- Functional segment tabs Day | Week | Month | Year.
- Day: hourly steps bar/line, activity timeline.
- Week: 7-day interactive bar chart with goal line, completed days, avg steps, distance, best day.
- Month: tappable calendar heatmap; days completed, missed, planned rest, missing data, current progress distinct.
- Year: annual consistency heatmap or monthly bar chart with streak and completion rate.
- Tap a missed eligible day to show a reflection bottom sheet; reasons Busy, Unwell, Rest/recovery, Weather, Travel, Forgot, Other, plus optional note. Save & skip work; current day should not prompt failure; no-data day != missed day. Reflection persists and appears in day details. Editable target from settings and health.
- Insight cards computed from seed activity data, not disconnected canned stats. Supportive and nonjudgmental copy.

FINANCE
Two tabs Expenses / Investments.
Expenses: budget hero spent ₹8,450 / ₹15,000 as demo, remaining, monthly trend line and category donut chart with legend/tooltip; filterable transaction list with merchant, category, date, amount. Functional Add Expense button opens mobile bottom sheet (amount, description, category, date, payment type) and updates persisted state, totals, charts. Voice-entry PROTOTYPE: prominent mic button launches simulated voice capture overlay with animated waveform, editable transcript input "Spent 180 rupees on lunch today", rules-based parser extracting amount/category/date; confirm before saving. Clearly label this a simulated voice flow—no microphone or offline STT integration yet. Category detection from merchant/keywords and manual override, not claim real ML.
Investments: portfolio value, invested amount, unrealized P&L, trend chart, allocation donut, holdings list with sample Indian stocks & clear demo tags, security-detail page or drawer with qty/price. Filters for periods (charts can use consistent sample snapshots). "Connect broker" opens a provider chooser for ICICI Direct, Zerodha, Manual with clear "Coming later / Not connected", no authentication fields, no fake live status.

FEED
Editorial calm high-quality news experience. City | National | International segmented filter; default city Chennai, changeable in settings. Horizontal topic chips For You, AI, Technology, Finance, Science, Business. Functional topic selection, saved articles, tapping articles opens a handsome reader/detail view with summary and source attribution. All news ARTICLES MUST be clearly labeled "Illustrative demo article" and not pretend to be real current news, and avoid fake real external links. Daily Briefing summary card. Nice images if legally available; fall back to original abstract editorial thumbnail gradients (no broken links). Bookmark action persists.

CHAT
Modern thoughtful AI workspace: conversation bubbles, demo generated responses to selected quick prompts grounded in demo state (weekly activity summary, expenses overview, feed recommendations), composer, conversation history stored locally, typing indicator. Clearly "Demo assistant" and laptop card "Offline — not connected". Mock device-connection screen with endpoint preference UI but do not actually call external URLs or expose filesystem. Explain full laptop-agent wiring comes later. Provide message error state and copy button where relevant. Small workspace context chip "Laptop agent • offline".

SETTINGS
Appearance theme, health goal target, monthly spending budget, city, topics, demo reset, integrations list with transparent availability. Save controls and show user-facing confirmation.

REQUIRED DESIGN AND INTERACTION QUALITY
Every tab and toggle should function. Make Home and Health particularly striking, with polished charts and spacing. Build all five polished pages and their key subflows, not placeholders. Use semantic accessible controls, keyboard focus, chart alt summaries, safe-area, smooth transitions, fixed nav not covering content, responsive chart sizes, proper touch sizes. Do not call external APIs. Keep architecture modular (components for shell, cards, charts, mock data, hooks/state). Avoid code giant single-page implementation. Use a simple typed data model for dates and transaction arithmetic. Make it easy to export/reimplement in native Android later.

IMPLEMENT NOW rather than planning only. After coding, check build/TypeScript errors and key interactions; describe what works, what is simulated, and any remaining gaps.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f34de01d-b543-40a5-a452-5cae13db49a2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
