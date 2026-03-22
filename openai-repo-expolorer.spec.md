# GitHub Repo Explorer — Project Spec

## Overview

A Next.js (App Router) page that displays OpenAI's public GitHub repositories as cards. Repos are fetched server-side on initial load, hydrated into TanStack Query on the client for caching/state management, and filterable by name via a real-time search input — no reloads, no additional API calls.

---

## Tech Stack

| Tool              | Purpose                                                |
| ----------------- | ------------------------------------------------------ |
| Next.js 14+       | App Router, Server Components, React Server Components |
| TanStack Query v5 | Server state management, caching, hydration            |
| Tailwind CSS      | Utility-first styling                                  |
| shadcn/ui         | Component primitives (Card, Input, Badge, Skeleton)    |
| TypeScript        | Type safety throughout                                 |

---

## Coding Conventions

- **Arrow functions only** — use `const MyComponent = () => {}` everywhere. No `function` keyword unless strictly required (e.g., Next.js `generateMetadata`).
- **Interface prefix** — all TypeScript interfaces use `I` prefix: `IGithubRepo`, `IRepoCardProps`, `ISearchInputProps`, etc.
- **Package manager** — `pnpm` exclusively. No `npm` or `yarn`.
- **Named exports** — prefer `export const` over `export default` for components. Use `export default` only where Next.js requires it (page, layout).

---

```
app/
├── layout.tsx                  # Root layout — wraps children with QueryProvider
├── page.tsx                    # Server Component — fetches repos, passes as initialData
├── providers/
│   └── query-provider.tsx      # "use client" — QueryClientProvider setup
├── components/
│   ├── repo-explorer.tsx       # "use client" — main client component (holds search state)
│   ├── search-input.tsx        # Controlled input, receives value + onChange from parent
│   ├── repo-card-grid.tsx      # Receives searchTerm, filters + renders cards
│   ├── repo-card.tsx           # Single repo card display
│   ├── repo-card-skeleton.tsx  # Skeleton loader card for loading state
│   └── error-state.tsx         # User-friendly error display with retry
├── lib/
│   └── github.ts               # Fetch function + TypeScript types
└── hooks/
    └── use-repos.ts            # Custom hook wrapping useQuery with initialData
```

---

## Data Flow

### Step 1 — Server-side fetch (no loading spinner on first visit)

`app/page.tsx` is a **Server Component**. It calls the fetch function directly at the top level.

```
// page.tsx (Server Component)
import { fetchRepos } from "@/lib/github"
import { RepoExplorer } from "@/components/repo-explorer"

const Page = async () => {
  const initialData = await fetchRepos("openai")
  return <RepoExplorer initialData={initialData} />
}

export default Page
```

Key points:

- This runs on the server at request time
- The HTML sent to the browser already contains the rendered repo cards — no flash of loading state
- If the server fetch fails, pass `null` or an empty array so the client can handle it gracefully

### Step 2 — Hydrate into TanStack Query

`RepoExplorer` is a client component. It receives `initialData` and passes it to a custom hook.

```
// hooks/use-repos.ts
"use client"
import { useQuery } from "@tanstack/react-query"

export const useRepos = (initialData: IGithubRepo[]) => {
  return useQuery({
    queryKey: ["repos", "openai"],
    queryFn: () => fetch("https://api.github.com/users/openai/repos?per_page=100&sort=stars")
                    .then(res => {
                      if (!res.ok) throw new Error("Failed to fetch")
                      return res.json()
                    }),
    initialData: initialData,
    staleTime: 5 * 60 * 1000,   // 5 minutes before considered stale
  })
}
```

Key points:

- `initialData` means TanStack Query has data immediately — no loading state on mount
- If the data becomes stale and the user refocuses the tab, TanStack will silently refetch in the background
- `isLoading`, `isError`, `error` are all available from the hook for free

### Step 3 — Client-side search (useState in parent)

`RepoExplorer` holds a `searchTerm` state via `useState`. It passes:

- `searchTerm` + `setSearchTerm` → `SearchInput` (one level down)
- `searchTerm` → `RepoCardGrid` (one level down)

This is **not** prop drilling. It's two sibling components sharing state through their direct parent — standard React.

```
// repo-explorer.tsx
"use client"
import { useState } from "react"

export const RepoExplorer = ({ initialData }: { initialData: IGithubRepo[] }) => {
  const { data: repos, isLoading, isError, error } = useRepos(initialData)
  const [searchTerm, setSearchTerm] = useState("")

  if (isLoading) return <SkeletonGrid />
  if (isError)   return <ErrorState message={error.message} />

  return (
    <>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <RepoCardGrid repos={repos} searchTerm={searchTerm} />
    </>
  )
}
```

### Step 4 — Filtering logic

Inside `RepoCardGrid`, filter the repos array using the search term:

```
const filtered = useMemo(
  () => repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  ),
  [repos, searchTerm]
)
```

- `useMemo` prevents re-filtering on unrelated re-renders
- Case-insensitive matching
- No API calls, no page reloads — purely client-side

---

## TypeScript Types

```ts
// lib/github.ts

export interface IGithubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  topics: string[];
  fork: boolean;
  updated_at: string;
}

export const fetchRepos = async (username: string): Promise<IGithubRepo[]> => {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=stars`,
    { next: { revalidate: 300 } }, // ISR: revalidate every 5 minutes
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
};
```

---

## Component Specs

### `SearchInput`

- shadcn `Input` component
- Placeholder: "Search repositories..."
- Search icon (Lucide `Search`) inside the input as a left icon
- Controlled component: receives `value` and `onChange` props
- Debounce is optional — for ~30-100 repos, instant filtering is fine

### `RepoCard`

Each card displays:

| Field           | Handling                                                     |
| --------------- | ------------------------------------------------------------ |
| **name**        | Bold, prominent — link to `html_url`                         |
| **description** | If `null`, show italic fallback: _"No description provided"_ |
| **language**    | Colored badge/dot — use a language-to-color map              |
| **star count**  | Star icon (Lucide `Star`) + formatted number                 |

Use shadcn `Card`, `CardHeader`, `CardContent`, `Badge`.

### `RepoCardGrid`

- CSS Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- If filtered list is empty, show a friendly "No repos match your search" message
- Apply `useMemo` for filtering

### `RepoCardSkeleton`

- Matches the card layout with shadcn `Skeleton` blocks
- Show 6 skeleton cards during loading
- Pulse animation (Tailwind `animate-pulse`)

### `ErrorState`

- Friendly message: "Something went wrong while fetching repositories"
- Show the actual error message in smaller text below
- "Try again" button that triggers `refetch()` from TanStack Query

---

## TanStack Query Setup

### QueryProvider

```
// providers/query-provider.tsx
"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 2,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### Wrap in layout.tsx

```
// layout.tsx
import { QueryProvider } from "@/providers/query-provider"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
```

---

## UI / Styling Direction

- **Theme**: Colorful and playful — not corporate or muted
- **Design system**: shadcn/ui components as the base, customized with Tailwind
- **Color palette**: Vibrant accents — use language colors as the primary color source (Python yellow, TypeScript blue, etc.)
- **Cards**: Rounded corners (`rounded-xl`), subtle shadows, hover effects (scale or shadow lift)
- **Typography**: Clean and readable — shadcn defaults are fine
- **Layout**: Centered container, generous spacing, responsive grid
- **Animations**: Subtle card entrance animation, smooth hover transitions
- **Empty state**: Friendly illustration or icon when search returns no results
- **Page header**: Show OpenAI's name/avatar with a brief intro line

---

## Handling Edge Cases

| Case                    | Behavior                                                 |
| ----------------------- | -------------------------------------------------------- |
| Repo has no description | Show _"No description provided"_ in muted/italic text    |
| Repo has no language    | Either hide the badge or show "Unknown"                  |
| API rate limit (403)    | Show error state with message about rate limiting        |
| Network failure         | Show error state with retry button                       |
| Username has 0 repos    | Show friendly empty state: "No public repos found"       |
| Search matches nothing  | Show inline message: "No repos match your search"        |
| Server fetch fails      | Pass empty array to client, let TanStack retry on client |

---

## Dependencies to Install

```bash
# Core
pnpm create next-app@latest github-repo-explorer --typescript --tailwind --app --eslint

# TanStack Query
pnpm add @tanstack/react-query

# shadcn/ui setup
pnpm dlx shadcn@latest init

# shadcn components needed
pnpm dlx shadcn@latest add card input badge skeleton
# badge may need to be added separately if not available — use a custom one

# Icons
pnpm add lucide-react
```

---

## File Creation Order

Follow this order to avoid import errors while building:

1. `lib/github.ts` — types + fetch function (no dependencies)
2. `providers/query-provider.tsx` — TanStack provider
3. `app/layout.tsx` — wrap with QueryProvider
4. `hooks/use-repos.ts` — custom hook
5. `components/repo-card.tsx` — single card (leaf component)
6. `components/repo-card-skeleton.tsx` — skeleton card
7. `components/search-input.tsx` — search input
8. `components/error-state.tsx` — error display
9. `components/repo-card-grid.tsx` — grid + filtering logic
10. `components/repo-explorer.tsx` — main orchestrator
11. `app/page.tsx` — server component entry point

---

## Summary

- **Server fetch** → no loading spinner on initial page load
- **TanStack Query** → handles caching, background refetch, loading/error states
- **useState in parent** → simple, appropriate state sharing for search
- **useMemo** → efficient client-side filtering
- **shadcn/ui + Tailwind** → polished, colorful, playful UI
- **Zero prop drilling** — search state goes one level down to sibling components
- **Zero unnecessary abstraction** — no Context API, no Redux, no over-engineering
