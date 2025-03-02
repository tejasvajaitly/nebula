import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { Octokit } from "@octokit/rest";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repoId = searchParams.get("repoId");
  const accountId = searchParams.get("accountId");
  const { sessionId } = await auth();

  if (!sessionId) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const template = "supabase";
  const client = await clerkClient();
  const token = await client.sessions.getToken(sessionId, template);

  const supabaseClient = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${token.jwt}`);
          return fetch(url, { ...options, headers });
        },
      },
    }
  );

  // Get GitHub session key for the organization
  const { data: githubSession, error: sessionError } = await supabaseClient
    .from("github_sessions")
    .select("session_key")
    .eq("github_account_id", accountId)
    .single();

  if (sessionError) {
    return Response.json(
      { message: "Error fetching sessions token" },
      { status: 500 }
    );
  }

  // Initialize GitHub client
  const octokit = new Octokit({
    auth: githubSession.session_key,
  });

  const repository = await octokit.request(`GET /repositories/${repoId}`);

  // Get commits from GitHub
  const commits = await octokit.paginate(octokit.rest.repos.listCommits, {
    owner: repository.data.owner.login,
    repo: repository.data.name,
    per_page: 100,
  });

  return Response.json([...commits], { status: 200 });
}
