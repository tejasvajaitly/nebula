import { Octokit } from "@octokit/rest";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

async function createClerkSupabaseClientSsr() {
  // The `useAuth()` hook is used to access the `getToken()` method
  const { getToken, sessionClaims } = await auth();

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date_from = searchParams.get("date_from");
  const repo_id = searchParams.get("repo_id");
  const repo_name = searchParams.get("repo_name");
  const repo_owner = searchParams.get("repo_owner");
  const github_account_id = searchParams.get("github_account_id");

  const client = await createClerkSupabaseClientSsr();

  const res = await client
    .from("github_sessions")
    .select("*")
    .eq("github_account_id", github_account_id)
    .single();

  if (!repo_name || !repo_owner || !date_from) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const octokit = new Octokit({ auth: res?.data?.session_key });

  try {
    const { data: commits } = await octokit.request(
      `GET /repos/${repo_owner}/${repo_name}/commits`,
      {
        since: `${date_from}T00:00:00Z`,
      }
    );
    console.log("commits", commits);

    return Response.json(commits);
  } catch (error) {
    console.log("error", error);
    return Response.json({ error: "Failed to fetch commits" }, { status: 500 });
  }
}
