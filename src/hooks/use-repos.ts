"use client";

import { useQuery } from "@tanstack/react-query";
import type { IGithubRepo } from "@/lib/github";

export const useRepos = (initialData: IGithubRepo[]) => {
  return useQuery({
    queryKey: ["repos", "openai"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_GITHUB_API_URL}/users/openai/repos?sort=`,
      ).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch repositories");
        return res.json();
      }),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
};
