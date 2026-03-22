"use client";

import { Star, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IGithubRepo } from "@/lib/github";

export interface IRepoCardProps {
  repo: IGithubRepo;
}

const languageColors: Record<string, string> = {
  Python: "bg-[#3572A5]",
  TypeScript: "bg-[#3178C6]",
  JavaScript: "bg-[#F7DF1E] ",
  Rust: "bg-[#DEA584] ",
  Go: "bg-[#00ADD8]",
  C: "bg-[#555555]",
  "C++": "bg-[#F34B7D]",
  "C#": "bg-[#239120]",
  Java: "bg-[#B07219]",
  Ruby: "bg-[#CC342D]",
  Swift: "bg-[#FA7343]",
  Kotlin: "bg-[#A97BFF]",
  Jupyter: "bg-[#DA5B0B] text-red",
  "Jupyter Notebook": "bg-[#DA5B0B]",
  Cuda: "bg-[#3A4E3A]",
  Shell: "bg-[#89E051] ",
  HTML: "bg-[#E34C26]",
  CSS: "bg-[#563D7C]",
  Dockerfile: "bg-[#384D54]",
};

const formatStars = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

export const RepoCard = ({ repo }: IRepoCardProps) => {
  const colorClass = repo.language
    ? languageColors[repo.language] ?? "bg-red-500 text-red"
    : null;

  return (
    <Card className="group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex capitalize items-center gap-1.5 font-semibold text-lg text-foreground hover:text-primary transition-colors"
          >
            {repo.name}
            <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <div className="flex items-center gap-1 text-amber-500 shrink-0">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">
              {formatStars(repo.stargazers_count)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <p
          className={`text-sm leading-relaxed line-clamp-2 ${
            repo.description
              ? "text-muted-foreground"
              : "text-muted-foreground/60 italic"
          }`}
        >
          {repo.description || "No description provided"}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {colorClass && (
            <Badge
              variant="secondary"
              className={`${colorClass} text-xs uppercase text-red-100 font-medium`}
            >
              {repo.language}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
