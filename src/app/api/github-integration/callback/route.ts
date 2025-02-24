import { Octokit } from "@octokit/rest";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

async function createClerkSupabaseClientSsr() {
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return Response.json({ error: "No OAuth code provided" }, { status: 400 });
  }

  // Exchange OAuth code for access token
  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    }
  );

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    return Response.json(
      { error: "Failed to get access token" },
      { status: 401 }
    );
  }

  // Fetch GitHub User Data
  const octokit = new Octokit({ auth: tokenData.access_token });
  const { data: user } = await octokit.rest.users.getAuthenticated();

  const client = await createClerkSupabaseClientSsr();

  // Assuming you have a way to extract the organization_id from the JWT
  // Implement this function

  const res = await client.from("github_sessions").upsert(
    [
      {
        github_account_id: user.id.toString(),

        session_key: tokenData.access_token,
      },
    ],
    {
      onConflict: "github_account_id,organization_id", // Join fields into a single string
    }
  );

  if (res.error) {
    return Response.json({ error: res.error.message }, { status: 400 });
  }

  redirect(`/dashboard`);
}
