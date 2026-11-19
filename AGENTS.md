<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- ORBIT is a client-only demo: all state lives in `src/lib/orbit/store.tsx` (localStorage), no backend or external API calls — keeps the prototype safe and portable to native later.
- Domain logic (dates, seeded activity, finance math, parser, feed, chat replies) stays pure in `src/lib/orbit/*`; UI in `src/components/orbit/*` only derives from it, so every widget shows the same numbers.
- Demo data is deterministic (hash of ISO date), never `Math.random()` — values stay stable across renders and reloads.

- Shared visual tokens and panel geometry live in `src/styles.css`; Health overrides tokens only inside `.health-area` (including its portal sheets), so its light identity cannot restyle the shell or other modules. Health owns its motion; `Page` owns other modules' viewport reveals.
- Editorial thumbnails use original deterministic vector signal artwork rather than external media, keeping the demo offline and avoiding copied reference assets.
- Pace uses one reusable layered SVG and event-driven animation controller; contextual mood stays pure in the domain layer and wardrobe preferences stay in the existing ORBIT store, so previews never mutate activity totals.
