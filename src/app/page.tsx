import { fetchRepos } from "@/lib/github";
import { RepoExplorer } from "@/features/repos/components/repo-explorer";
import { Header } from "@/components/header";

const Page = async () => {
  let initialData: Awaited<ReturnType<typeof fetchRepos>> = [];
  let serverError: string | null = null;

  try {
    initialData = await fetchRepos("openai");
  } catch (error) {
    serverError =
      error instanceof Error ? error.message : "Failed to fetch repositories";
  }

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Header />
      <RepoExplorer initialData={initialData} serverError={serverError} />
    </main>
  );
};

export default Page;
