import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export const Header = () => {
  return (
    <header className="mb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="https://avatars.githubusercontent.com/u/14957082?s=64&v=4"
            alt="OpenAI"
            width={48}
            height={48}
            className="rounded-full ring-2 ring-border"
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">OpenAI Repositories</h1>
            <p className="text-muted-foreground">
              Exploring open-source projects from OpenAI
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
