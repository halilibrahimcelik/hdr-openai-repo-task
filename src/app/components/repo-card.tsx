"use client"

import { Star, ExternalLink } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { IGithubRepo } from "@/lib/github"

export interface IRepoCardProps {
  repo: IGithubRepo
}

const languageColors: Record<string, string> = {
  Python: "bg-[#3572A5] text-white",
  TypeScript: "bg-[#3178C6] text-white",
  JavaScript: "bg-[#F7DF1E] text-black",
  Rust: "bg-[#DEA584] text-black",
  Go: "bg-[#00ADD8] text-white",
  C: "bg-[#555555] text-white",
  "C++": "bg-[#F34B7D] text-white",
  "C#": "bg-[#239120] text-white",
  Java: "bg-[#B07219] text-white",
  Ruby: "bg-[#CC342D] text-white",
  Swift: "bg-[#FA7343] text-white",
  Kotlin: "bg-[#A97BFF] text-white",
  Jupyter: "bg-[#DA5B0B] text-white",
  "Jupyter Notebook": "bg-[#DA5B0B] text-white",
  Cuda: "bg-[#3A4E3A] text-white",
  Shell: "bg-[#89E051] text-black",
  HTML: "bg-[#E34C26] text-white",
  CSS: "bg-[#563D7C] text-white",
  Dockerfile: "bg-[#384D54] text-white",
}

const formatStars = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

export const RepoCard = ({ repo }: IRepoCardProps) => {
  const colorClass = repo.language
    ? languageColors[repo.language] || "bg-gray-500 text-white"
    : null

  return (
    <Card className="group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-lg text-foreground hover:text-primary transition-colors"
          >
            {repo.name}
            <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <div className="flex items-center gap-1 text-amber-500 shrink-0">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{formatStars(repo.stargazers_count)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <p className={`text-sm leading-relaxed line-clamp-2 ${repo.description ? "text-muted-foreground" : "text-muted-foreground/60 italic"}`}>
          {repo.description || "No description provided"}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {colorClass && (
            <Badge variant="secondary" className={`${colorClass} text-xs font-medium`}>
              {repo.language}
            </Badge>
          )}
          {repo.topics.slice(0, 3).map((topic) => (
            <Badge
              key={topic}
              variant="outline"
              className="text-xs text-muted-foreground"
            >
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
