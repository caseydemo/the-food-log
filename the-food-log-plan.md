# the-food-log — Technical Architecture Plan

> A mobile-first food tracking app built with Next.js 16, MongoDB, Mongoose, Storyblok, and Jest.

---

## Context

Building a mobile-first food tracking app from scratch. Core data (foods, logs) lives in MongoDB via Mongoose, served through Next.js API routes. Storyblok is layered on as an optional headless CMS for editorial content (help pages, onboarding, food category descriptions) — kept entirely separate from the CRUD logic. No Bootstrap or Tailwind; CSS Modules for scoped, mobile-first styles. All code covered by Jest tests.

---

## Tech Stack

| Layer       | Technology                                         |
|-------------|----------------------------------------------------|
| Framework   | Next.js 16 — App Router, TypeScript strict mode    |
| Database    | MongoDB with Mongoose 8                            |
| CMS         | Storyblok (headless) — editorial content only      |
| Styling     | CSS Modules, mobile-first, no utility frameworks   |
| Testing     | Jest + React Testing Library, 80%+ coverage        |
| Linting     | ESLint (next/core-web-vitals + typescript) + Prettier |

---

## Architecture

```
Next.js 16 (App Router, TypeScript)
  ├── /api/foods  &  /api/logs  ──►  Mongoose  ──►  MongoDB
  ├── Pages & Components         ──►  CSS Modules (mobile-first)
  └── /[slug]                    ──►  Storyblok CMS stories
```

---

## Project Structure

```
the-food-log/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard / recent logs
│   │   ├── foods/
│   │   │   ├── page.tsx                # Food list
│   │   │   ├── new/page.tsx            # Create food
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Food detail
│   │   │       └── edit/page.tsx       # Edit food
│   │   ├── logs/
│   │   │   ├── page.tsx                # Log history
│   │   │   ├── new/page.tsx            # Create log entry
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Log detail
│   │   │       └── edit/page.tsx
│   │   ├── api/
│   │   │   ├── foods/route.ts          # GET list, POST
│   │   │   ├── foods/[id]/route.ts     # GET, PUT, DELETE
│   │   │   ├── logs/route.ts           # GET list, POST
│   │   │   └── logs/[id]/route.ts      # GET, PUT, DELETE
│   │   └── [slug]/page.tsx             # Storyblok CMS pages
│   ├── models/
│   │   ├── Food.ts                     # Mongoose Food model
│   │   └── Log.ts                      # Mongoose Log model
│   ├── lib/
│   │   ├── db.ts                       # MongoDB connection singleton
│   │   └── storyblok.ts                # Storyblok client + helpers
│   ├── components/
│   │   ├── FoodCard/
│   │   │   ├── FoodCard.tsx
│   │   │   ├── FoodCard.module.css
│   │   │   └── FoodCard.test.tsx
│   │   ├── LogEntry/
│   │   │   ├── LogEntry.tsx
│   │   │   ├── LogEntry.module.css
│   │   │   └── LogEntry.test.tsx
│   │   └── ui/                         # Shared primitives (Button, Input, etc.)
│   └── types/
│       ├── food.ts
│       └── log.ts
├── __tests__/
│   ├── api/
│   │   ├── foods.test.ts               # API route integration tests
│   │   └── logs.test.ts
│   ├── models/
│   │   ├── Food.test.ts                # Mongoose model unit tests
│   │   └── Log.test.ts
│   └── lib/
│       └── db.test.ts
├── jest.config.ts
├── jest.setup.ts
├── .env.local.example
├── next.config.ts
└── tsconfig.json
```

---

## Data Models

### Food — `src/models/Food.ts`

```typescript
{
  name:        string    // required
  description: string?
  calories:    number?
  protein:     number?   // grams
  carbs:       number?   // grams
  fat:         number?   // grams
  servingSize: string?   // e.g. "100g", "1 cup"
  category:    string?   // e.g. "protein", "grain", "vegetable"
  createdAt:   Date      // auto via timestamps: true
  updatedAt:   Date      // auto
}
```

### Log — `src/models/Log.ts`

```typescript
{
  food:      ObjectId  // ref: 'Food', required
  quantity:  number    // required
  unit:      string?   // e.g. "servings", "grams"
  notes:     string?
  loggedAt:  Date      // defaults to Date.now
  createdAt: Date      // auto
  updatedAt: Date      // auto
}
```

---

## API Routes

| Method   | Path               | Action           |
|----------|--------------------|------------------|
| `GET`    | `/api/foods`       | List all foods   |
| `POST`   | `/api/foods`       | Create food      |
| `GET`    | `/api/foods/[id]`  | Get food by ID   |
| `PUT`    | `/api/foods/[id]`  | Update food      |
| `DELETE` | `/api/foods/[id]`  | Delete food      |
| `GET`    | `/api/logs`        | List all logs    |
| `POST`   | `/api/logs`        | Create log entry |
| `GET`    | `/api/logs/[id]`   | Get log by ID    |
| `PUT`    | `/api/logs/[id]`   | Update log entry |
| `DELETE` | `/api/logs/[id]`   | Delete log entry |

---

## Storyblok Integration

- Used for CMS-managed content only (help, about, onboarding, food category info)
- `src/lib/storyblok.ts` — initialises the `@storyblok/next` client
- `src/app/[slug]/page.tsx` — catches CMS slugs and renders Storyblok stories
- Core app logic (foods/logs CRUD) is completely decoupled from Storyblok

---

## Styling

- CSS Modules — scoped per component, zero unintended side-effects
- Mobile-first: base styles target small screens, `@media (min-width: ...)` scales up
- Design tokens via CSS custom properties in `globals.css` (colors, spacing, type scale)
- No Tailwind, no Bootstrap — handwritten component styles only

---

## Testing Strategy

| Scope            | Approach                                                           |
|------------------|--------------------------------------------------------------------|
| Model tests      | Schema validation, required fields, defaults, virtuals             |
| API route tests  | `node-mocks-http` + `mongodb-memory-server` (no live DB needed)    |
| Component tests  | React Testing Library for all UI components                        |
| lib tests        | DB connection singleton, Storyblok helper functions                |
| Coverage target  | 80%+ across all files                                              |

**Key packages:** `jest` · `ts-jest` · `@testing-library/react` · `@testing-library/jest-dom` · `mongodb-memory-server` · `node-mocks-http`

---

## Environment Variables

```bash
# .env.local
MONGODB_URI=mongodb+srv://...
STORYBLOK_TOKEN=your_preview_token
NEXT_PUBLIC_STORYBLOK_TOKEN=your_public_token
```

---

## Implementation Steps

1. `npx create-next-app@16 the-food-log` — TypeScript, App Router, ESLint, no Tailwind, `src/` directory
2. Install deps: `mongoose` `@storyblok/next` `storyblok-js-client`
3. Install dev deps: `jest` `ts-jest` `@testing-library/react` `@testing-library/jest-dom` `mongodb-memory-server` `node-mocks-http` `@types/jest`
4. Configure `jest.config.ts` and `jest.setup.ts`
5. Create `src/lib/db.ts` — MongoDB connection singleton with caching
6. Create Mongoose models: `Food.ts` and `Log.ts` (with `timestamps: true`)
7. Write model unit tests
8. Create API routes for `/api/foods` and `/api/logs` (full CRUD)
9. Write API integration tests using `mongodb-memory-server`
10. Create `src/lib/storyblok.ts` + `[slug]` CMS page
11. Build shared UI components (`Button`, `Input`, etc.) with CSS Modules
12. Build all pages: dashboard, foods (list / detail / form), logs (list / detail / form)
13. Write component tests with React Testing Library
14. Create `.env.local.example` with all required vars
15. Final lint + test pass — confirm coverage ≥ 80%

---

## Verification

- [ ] `npm run dev` → app loads at `localhost:3000`, dashboard renders
- [ ] `npm test` → all tests pass, coverage ≥ 80%
- [ ] `npm run lint` → zero errors
- [ ] Manual CRUD: create a food item, create a log referencing it, edit both, delete both
- [ ] Navigate to a Storyblok-managed slug and confirm CMS page renders

---

*Generated by Claude Code*
