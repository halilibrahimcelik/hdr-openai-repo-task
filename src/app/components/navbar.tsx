"use client"

import { Github } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <div className="flex items-center gap-2 font-semibold">
          <Github className="h-5 w-5" />
          <span>GitHub Explorer</span>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  )
}
