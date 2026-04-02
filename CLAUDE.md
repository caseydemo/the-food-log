@AGENTS.md

# Project Handoff — the-food-log

## What this is
A mobile-first food tracking app. Users log food items and meals against a library of custom food objects. Fast, minimal UI — the core loop is: pick a food → log it → see it on the dashboard.

## Stack
| Layer       | Technology                                                      |
|-------------|-----------------------------------------------------------------|
| Framework   | Next.js 16 — App Router, TypeScript strict mode                 |
| Database    | MongoDB Atlas Flex + Mongoose 8                                 |
| Auth        | Clerk (magic link, no passwords)                                |
| CMS         | Storyblok — wired but not yet configured, for editorial content |
| Styling     | CSS Modules, mobile-first, no utility frameworks                |
| Testing     | Jest + React Testing Library — 42 tests, all passing            |

## Repo & branches
- **Repo:** https://github.com/caseydemo/the-food-log
- **`production`** — default branch, stable releases only
- **`dev`** — active working branch, branch off this for features

## What's been built
- Mongoose models: `Food` and `Log` (see `src/models/`)
- Full REST API: `GET/POST/PUT/DELETE` for `/api/foods` and `/api/logs`
- All pages: dashboard (today's logs), foods (list/detail/create/edit), logs (list/detail/create/edit)
- Shared UI components: `Button`, `Input`, `NavBar`, `FoodCard`, `LogEntry`
- Mobile-first bottom nav bar, switches to sidebar on wider screens
- Clerk auth protecting all routes — unauthenticated users redirected to `/sign-in`
- Storyblok client at `src/lib/storyblok.ts`, dynamic CMS page at `src/app/[slug]/page.tsx`

## What's NOT done yet
- **Deployment** — Digital Ocean was "decide later", nothing configured
- **Storyblok** — client is wired, tokens are empty in `.env.local`, no content created in Storyblok dashboard yet
- **Error boundaries / loading states** — pages hit the DB directly, no skeleton UI
- **User-scoped data** — logs and foods are not tied to a Clerk user ID yet (all users share the same data pool)
- **`package.json` name** — still says `the-food-log-temp`, leftover from scaffold workaround

## Environment variables
See `.env.local.example` for the full list. Required to run:
```
MONGODB_URI               # Atlas Flex connection string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_FALLBACK_REDIRECT_URL=/
```

## Running locally
```bash
npm run dev     # http://localhost:3000
npm test        # 42 tests, all passing
npm run lint    # zero errors
```

## Known quirks
- There's a root-level `package.json` and `node_modules` in `C:\Users\cdema\code\` (unrelated projects). Next.js warns about multiple lockfiles — already suppressed via `turbopack.root` in `next.config.ts`.
- The `gh` CLI is installed at `C:\Program Files\GitHub CLI\gh.exe` — not on PATH in bash, use full path.
- Git remote uses HTTPS (not SSH). Push requires `gh auth setup-git` to be run first if credentials expire.

## Owner preferences
- Best practice always — no shortcuts
- Mobile-first everything
- CSS Modules only, no Tailwind or Bootstrap
- Test every piece — Jest coverage target 80%+
- No confirmation needed for destructive operations within `C:\Users\cdema\code\`
