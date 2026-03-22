"use client";

import { useQuery } from "@tanstack/react-query";
import type { IGithubRepo } from "@/lib/github";

export const useRepos = (initialData: IGithubRepo[]) => {
  return useQuery({
    queryKey: ["repos", "openai"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GITHUB_API_URL}/users/openai/repos?per_page=100`,
      );

      if (!res.ok) throw new Error("Failed to fetch repositories");

      const repos: IGithubRepo[] = await res.json();

      return repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    },
    initialData,
    staleTime: 10 * 60 * 1000,
  });
};
