import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

type GitHubSession = {
  session_key: string;
};

export async function createClerkSupabaseClient() {
  const { getToken } = await auth();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        // Get the custom Supabase token from Clerk
        fetch: async (url, options = {}) => {
          const clerkToken = await getToken({
            template: "supabase",
          });

          // Insert the Clerk Supabase token into the headers
          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);

          // Now call the default fetch
          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
}

export async function getAllGithubSessionTokens() {
  const supabase = await createClerkSupabaseClient();
  const { data, error } = (await supabase
    .from("github_sessions")
    .select("session_key")) as {
    data: GitHubSession[];
    error: Error | null;
  };
  return data;
}

export async function getGithubSessionToken(githubProfileID: string) {
  const supabase = await createClerkSupabaseClient();
  const { data, error } = (await supabase
    .from("github_sessions")
    .select("session_key")
    .eq("github_account_id", githubProfileID)
    .single()) as {
    data: GitHubSession;
    error: Error | null;
  };
  return data;
}

export async function createChangelogProject(repo: string, repoId: string) {
  const supabase = await createClerkSupabaseClient();
  const { data, error } = await supabase.from("changelog_sites").insert({
    repository_name: repo,
    github_repository_id: repoId,
  });

  return data;
}

export async function updateChangelog(
  repoId: string,
  changelog: string,
  latestCommitSha: string,
  latestCommitDate: string
) {
  const supabase = await createClerkSupabaseClient();
  const { data, error } = await supabase.from("changelogs").insert([
    {
      github_repository_id: repoId,
      description: changelog,
      git_commit_sha: latestCommitSha,
      commit_date: latestCommitDate,
    },
  ]);
  return data;
}
