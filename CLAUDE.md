# WC 2026 Sweepstake — Claude Instructions

## Project
React 19 + Vite + Tailwind CSS + Framer Motion + Supabase + React Router v7 (HashRouter).
Colours: navy `#042A4E` (Safestore blue) + amber `#F99B1C` (Safestore amber).

## Accounts — PERSONAL ONLY

### Vercel
- **Use:** personal hobby account `matthewkayne` (Vercel slug `aldrix-ai`, plan: hobby)
- **Never use:** `aldrix-ai-63889175` ("Aldrix AI", plan: pro)
- Project ID: `prj_HQYVR232C7KtWQ1aCpxD07LUNxij`
- Live URL: https://wc2026-sweepstake-tau.vercel.app
- Deployment: push to `main` on GitHub — Vercel git integration auto-deploys.
  Do NOT run `vercel deploy` manually; it defaults to the wrong team scope.
- CLI gotcha: the personal account cannot be set via `--scope`. If you must run
  the CLI manually, first ensure `~/Library/Application Support/com.vercel.cli/config.json`
  has no `currentTeam` key, then run without `--scope`.

### Supabase
- **Use:** Personal org ID `qdcxknhtawxniipuqquv` (name: "Personal")
- **Never use:** `stqnrdsqxkwpwfwbgxbt` ("Aldrix AI" org)
- Project ID: `jjvdjgmdnmgmpaacpjzb`, region: `eu-west-2`
- URL: `https://jjvdjgmdnmgmpaacpjzb.supabase.co`
- Always use the Supabase MCP tools; avoid raw SQL via Bash.

### GitHub
- Repo: `matthewkayne/wc2026-sweepstake` (personal, not an org)
- `git push origin main` triggers Vercel deploy automatically.

## Available Tools
- **Supabase MCP** (`mcp__supabase__*`) — DB migrations, logs, schema, project management
- **Context7 MCP** (`mcp__claude_ai_Context7__*`) — always use for library docs before coding
- **Vercel MCP** (`mcp__plugin_vercel_vercel__*`) — inspect deployments, env vars
- **gh CLI** (via Bash) — GitHub repo, PRs, secrets
- **Vercel API** (via `curl` + token from `~/Library/Application Support/com.vercel.cli/auth.json`) —
  use for env var management when MCP is unavailable

## Deployment workflow
1. Edit files
2. `git add <files> && git commit -m "..." && git push origin main`
3. Vercel picks up the push and deploys automatically (~60s)
4. No manual `vercel` CLI commands needed

## Supabase schema (already applied)
```sql
sessions    (id uuid pk, admin_token text, status text default 'lobby', created_at timestamptz)
participants(id uuid pk, session_id uuid fk→sessions, name text, avatar text,
             teams jsonb, pick_order integer, created_at timestamptz)
```
Both tables: RLS enabled (public read/write policies), realtime publication enabled.
Schema file: `supabase/schema.sql`

## Key design decisions
- **HashRouter** (not BrowserRouter) — required for static hosting compatibility
- **QR code URL** must be `${window.location.origin}/#/join/${sessionId}` — hardcoded `/`
  before `#` so it works regardless of pathname
- **Admin auth**: passphrase → SHA-256 hash (Web Crypto API) → stored in DB + localStorage
- **Team distribution**: snake draft, max 2 teams per player, top-ranked teams used first,
  lowest-ranked left unassigned. See `src/lib/distribution.js`.
- **Reset flow**: update session status to `lobby` FIRST (triggers realtime redirects),
  THEN clear participant teams — prevents flash of "No teams assigned"
