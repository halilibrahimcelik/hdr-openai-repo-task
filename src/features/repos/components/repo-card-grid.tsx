"use client"

import { useMemo } from "react"
import { SearchX } from "lucide-react"
import { RepoCard } from "./repo-card"
import type { IGithubRepo } from "@/lib/github"

export interface IRepoCardGridProps {
  repos: IGithubRepo[]
  searchTerm: string
}

export const RepoCardGrid = ({ repos, searchTerm }: IRepoCardGridProps) => {
  const filtered = useMemo(
    () =>
      repos.filter((repo) =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [repos, searchTerm]
  )

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No repos match your search</h3>
        <p className="text-sm text-muted-foreground">
          Try a different search term
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  )
}
