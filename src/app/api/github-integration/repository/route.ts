import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
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

  const { data: sessionsToken, error: sessionsTokenError } =
    await supabaseClient
      .from("github_sessions")
      .select("*")
      .eq("github_account_id", accountId);

  if (sessionsTokenError) {
    return Response.json(
      { message: "Error fetching sessions token" },
      { status: 500 }
    );
  }

  if (sessionsToken.length === 0) {
    return Response.json(
      {
        message:
          "There is some issue with the account please reauthorize the account",
      },
      { status: 404 }
    );
  }

  const repos = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${sessionsToken[0].session_key}`,
    },
  });

  const reposJson = await repos.json();

  if (reposJson.length === 0) {
    return Response.json({ repos: [] }, { status: 200 });
  }

  return Response.json({ repos: reposJson }, { status: 200 });
}
