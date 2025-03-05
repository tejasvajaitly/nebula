// ... existing code ...
import { Octokit } from "@octokit/rest";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// New endpoint to fetch user profiles and their repositories
export async function GET() {
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

  const { data, error } = await supabaseClient
    .from("github_sessions")
    .select("*");

  if (error) {
    return Response.json(
      { message: "Error fetching user profiles" },
      { status: 500 }
    );
  }

  if (data.length === 0) {
    return Response.json([], { status: 200 });
  }

  const userProfilesWithReposPromises = data.map(async (session) => {
    const octokit = new Octokit({
      auth: session.session_key,
    });

    try {
      const userResponse = await octokit.users.getAuthenticated();
      const reposResponse = await octokit.repos.listForAuthenticatedUser({
        per_page: 100,
      });

      return {
        user: userResponse.data,
        repositories: reposResponse.data,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        repositories: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

  const userProfilesWithRepos = await Promise.all(
    userProfilesWithReposPromises
  );

  return Response.json(userProfilesWithRepos, { status: 200 });
}
