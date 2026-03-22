export interface IGithubRepo {
  id: number
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  html_url: string
  topics: string[]
  fork: boolean
  updated_at: string
}

export const fetchRepos = async (username: string): Promise<IGithubRepo[]> => {
  const baseUrl = process.env.GITHUB_API_URL || "https://api.github.com"

  const res = await fetch(
    `${baseUrl}/users/${username}/repos?per_page=100&sort=stars`,
    { next: { revalidate: 300 } }
  )

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }

  return res.json()
}
