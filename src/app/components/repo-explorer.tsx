"use client"

import { useState } from "react"
import { useRepos } from "@/hooks/use-repos"
import { SearchInput } from "./search-input"
import { RepoCardGrid } from "./repo-card-grid"
import { SkeletonGrid } from "./repo-card-skeleton"
import { ErrorState } from "./error-state"
import type { IGithubRepo } from "@/lib/github"

export interface IRepoExplorerProps {
  initialData: IGithubRepo[]
}

export const RepoExplorer = ({ initialData }: IRepoExplorerProps) => {
  const { data: repos, isLoading, isError, error, refetch } = useRepos(initialData)
  const [searchTerm, setSearchTerm] = useState<string>("")

  if (isLoading) return <SkeletonGrid />
  if (isError) return <ErrorState message={error.message} onRetry={() => refetch()} />

  return (
    <div className="space-y-6">
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <RepoCardGrid repos={repos ?? []} searchTerm={searchTerm} />
    </div>
  )
}
