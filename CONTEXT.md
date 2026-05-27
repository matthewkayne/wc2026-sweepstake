# Project Context — WC 2026 Sweepstake

## What this is
A web app for a World Cup 2026 sweepstake. A host creates a session and shares a QR code.
Participants scan it, enter their name + pick an emoji avatar, and wait in a lobby.
When the host presses "Draw!", teams are randomly assigned using a snake draft (max 2 per player).
Results are shown with animated team cards.

## Tech stack
| Layer | Choice |
|---|---|
| Framework | React 19 + Vite 6 |
| Routing | React Router v7 — **HashRouter** |
| Styling | Tailwind CSS v3 (custom Safestore colours) |
| Animation | Framer Motion v11 |
| Database + Realtime | Supabase JS v2 |
| QR code | qrcode.react |
| Hosting | Vercel (personal hobby) via GitHub git integration |

## Colour scheme (Safestore brand)
- Navy blue: `#042A4E` — Tailwind `blue-700`
- Amber: `#F99B1C` — Tailwind `yellow-400`
These override the entire Tailwind blue/yellow scale in `tailwind.config.js`.

## File structure
```
/
├── CLAUDE.md               ← Claude instructions (accounts, tools, rules)
├── CONTEXT.md              ← This file
├── index.html
├── vite.config.js          ← base: './', manual chunks for splitting
├── tailwind.config.js      ← Safestore colour overrides
├── postcss.config.js
├── package.json
├── .env.example
├── supabase/
│   └── schema.sql          ← DB setup reference (already applied via MCP)
└── src/
    ├── App.jsx             ← createHashRouter, all routes
    ├── main.jsx
    ├── index.css
    ├── lib/
    │   ├── supabase.js     ← createClient from env vars
    │   ├── teams.js        ← 48 WC2026 teams with fifaRank 1–48
    │   ├── distribution.js ← snake draft, max 2 teams/player
    │   └── crypto.js       ← SHA-256 passphrase hashing (Web Crypto API)
    ├── components/
    │   ├── Logo.jsx        ← "WC" navy + "2026" amber
    │   ├── TeamCard.jsx    ← team display with tier colours
    │   └── Footer.jsx      ← "powered by aldrix·ai" (already created)
    └── pages/
        ├── Home.jsx        ← create session / enter session code
        ├── Admin.jsx       ← QR code, live lobby, Draw button, auth wall
        ├── Join.jsx        ← name + avatar form, dupe-join guard, draw-started screen
        ├── Waiting.jsx     ← live lobby, redirects on draw or refresh
        └── Results.jsx     ← animated team reveal, admin reset button
```

## Supabase
- Org: Personal (`qdcxknhtawxniipuqquv`) — NOT Aldrix AI
- Project: `jjvdjgmdnmgmpaacpjzb` (name: wc2026-sweepstake, eu-west-2)
- URL: `https://jjvdjgmdnmgmpaacpjzb.supabase.co`
- Anon key: in Vercel env vars (`VITE_SUPABASE_ANON_KEY`)
- Schema applied via MCP (no need to re-run `supabase/schema.sql`)
- Realtime enabled on both tables

## Vercel
- Account: matthewkayne personal hobby (`aldrix-ai` slug — this IS the hobby account)
- Project: `prj_HQYVR232C7KtWQ1aCpxD07LUNxij`
- Live URL: https://wc2026-sweepstake-tau.vercel.app
- GitHub connected: `matthewkayne/wc2026-sweepstake` → push to main = auto-deploy
- Env vars already set: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## GitHub
- Repo: https://github.com/matthewkayne/wc2026-sweepstake
- Branch: `main`
- Latest commit: `8716e0a` — bug fixes from full review

## Outstanding work (session ended due to filesystem permissions lock)
The following changes were planned but NOT yet committed. Write these files, then
`git add -A && git commit && git push`:

### 1. `src/lib/distribution.js` — cap at 2 teams per player
Replace the entire file with:
```js
import { TEAMS } from './teams'

export function distributeTeams(participants) {
  const n = participants.length
  if (n === 0) return []

  const sortedTeams = [...TEAMS].sort((a, b) => a.fifaRank - b.fifaRank)

  // Only use the top-ranked n*2 teams — worst-ranked left unassigned
  const teamsToUse = sortedTeams.slice(0, Math.min(n * 2, sortedTeams.length))

  const shuffled = [...participants]
    .map(p => ({ ...p, _r: Math.random() }))
    .sort((a, b) => a._r - b._r)

  const teamsBySlot = Array.from({ length: n }, () => [])

  let teamIdx = 0
  let round = 0
  while (teamIdx < teamsToUse.length) {
    const forward = round % 2 === 0
    for (let i = 0; i < n && teamIdx < teamsToUse.length; i++) {
      const slot = forward ? i : n - 1 - i
      teamsBySlot[slot].push(teamsToUse[teamIdx])
      teamIdx++
    }
    round++
  }

  return shuffled.map((p, i) => {
    const { _r, ...participant } = p
    return { ...participant, teams: teamsBySlot[i] }
  })
}
```

### 2. `src/pages/HowItWorks.jsx` — new page
Create this page at route `/#/how-it-works`. Content:
- Step-by-step how the draw works (scan QR → name/avatar → wait → draw → results)
- Team cap rule: max 2 teams per player, lowest-ranked teams left unassigned
- Tier system explanation (Elite top 12, Strong 13–24, Competitive 25–36, Underdog 37–48)
- Snake draft fairness explanation
- Link back to home
- Include `<Footer />` at the bottom

### 3. `src/App.jsx` — add HowItWorks route
Add: `{ path: '/how-it-works', element: <HowItWorks /> }`

### 4. `src/pages/Home.jsx` — add "How it works" link
Add a small link below the action buttons pointing to `/#/how-it-works`

### 5. All pages — add `<Footer />` at the bottom
Import `Footer` from `../components/Footer` and render at the bottom of:
- Home.jsx, Admin.jsx, Join.jsx, Waiting.jsx, Results.jsx, HowItWorks.jsx

`Footer.jsx` is ALREADY CREATED at `src/components/Footer.jsx`:
```jsx
export default function Footer() {
  return (
    <div className="mt-12 pb-8 flex justify-center">
      <a
        href="https://aldrix.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 opacity-40 hover:opacity-70 transition-opacity"
      >
        <span className="text-xs text-slate-500">powered by</span>
        <span className="text-sm font-light tracking-tight text-slate-800">
          aldrix<span className="font-medium" style={{ color: '#6366F1' }}>·ai</span>
        </span>
      </a>
    </div>
  )
}
```

## Admin auth flow
1. Admin creates session on Home → sets passphrase → SHA-256 hashed → stored in `sessions.admin_token`
2. Admin token also stored in `localStorage` as `admin_token_${sessionId}`
3. Admin page checks localStorage first (no passphrase needed same device/browser)
4. New device: enter passphrase → hash → compare with DB → store in localStorage

## Team distribution algorithm
- 48 teams, ranked 1 (Argentina/best) → 48 (New Zealand/worst) by FIFA ranking
- With N players: use only top N×2 teams (e.g. 10 players → teams ranked 1–20 used)
- Snake draft: round 0 forward (slot 0→best, slot N-1→Nth best), round 1 backward, etc.
- Result: every player gets 1 team from top half + 1 from bottom half of the assigned range
- Example 10 players: slot 0 gets [rank 1, rank 20], slot 9 gets [rank 10, rank 11]

## Realtime architecture
Each page subscribes to its own Supabase channel. Channels:
- `admin-${sessionId}` — INSERT on participants, UPDATE on sessions
- `waiting-${sessionId}` — INSERT on participants, UPDATE on sessions
- `join-${sessionId}` — UPDATE on sessions (draw-started detection)
- `results-${sessionId}` — UPDATE on sessions (reset detection)

All channels are cleaned up on component unmount via useEffect return.

## Key bugs already fixed
All fixes are in commit `8716e0a`. See commit message for full list. The most important:
- Join page: duplicate-join guard, late-joiner race, draw-started screen
- Waiting page: initial status check on mount (refresh after draw works)
- Admin page: single loadSession() call, no double-navigate after draw
- Results page: fetch error handling, dynamic team count, atomic reset order
