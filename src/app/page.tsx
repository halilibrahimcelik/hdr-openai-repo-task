import Image from "next/image"
import { fetchRepos } from "@/lib/github"
import { RepoExplorer } from "@/app/components/repo-explorer"

const Page = async () => {
  const initialData = await fetchRepos("openai")

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-2">
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
      </header>
      <RepoExplorer initialData={initialData} />
    </main>
  )
}

export default Page
