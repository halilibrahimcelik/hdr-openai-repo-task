# OpenAI GitHub Explorer

A web app that displays OpenAI's public GitHub repositories, sorted by stars. Built with server-side rendering and client-side hydration for a fast, seamless experience.

## How It Works

- **SSR-first**: Repositories are fetched server-side on initial page load via the public GitHub API (`https://api.github.com/users/openai/repos`)
- **Hydrated into TanStack Query**: Server-fetched data is passed as `initialData` to TanStack Query, which then owns the client-side cache and state management
- **Stale time of 10 minutes**: Data stays fresh for 10 minutes — after that, TanStack Query automatically refetches from the same API endpoint on window focus or component remount
- **Client-side filtering**: Search/filter is done entirely on the client using `useMemo` — no additional API calls or refetches happen while searching
- **Error & loading states**: TanStack Query handles error/loading states out of the box, with a `refetch` method available for retry-on-demand

## Tech Stack

- **Next.js** (App Router) + **TypeScript**
- **TanStack Query** — data fetching, caching, and state management
- **shadcn/ui** + **Tailwind CSS** — UI components and design tokens
- **next-themes** — dark/light theme toggle

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

```
GITHUB_API_URL=https://api.github.com
NEXT_PUBLIC_GITHUB_API_URL=https://api.github.com
```

## Project Structure

```
src/
├── app/                  # Next.js App Router (layout, page, globals)
├── components/           # Shared components (header, theme-toggle, ui)
├── features/
│   └── repos/            # Repo feature module
│       ├── components/   # RepoCard, RepoCardGrid, SearchInput, ErrorState, Skeleton
│       └── hooks/        # useRepos (TanStack Query hook)
├── lib/                  # GitHub API types and fetch function
└── providers/            # QueryClient + ThemeProvider setup
```