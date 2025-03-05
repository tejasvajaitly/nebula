import { createOAuthUserAuth } from "@octokit/auth-oauth-user";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Octokit } from "@octokit/rest";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return Response.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const auth = createOAuthUserAuth({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      code,
    });

    const { token } = await auth();

    const octokit = new Octokit({
      auth: token,
    });

    const userResponse = await octokit.rest.users.getAuthenticated();

    const supabase = await createClerkSupabaseClient();
    const res = await supabase.from("github_sessions").upsert(
      [
        {
          github_account_id: userResponse.data.id.toString(),
          session_key: token,
        },
      ],
      {
        onConflict: "github_account_id,organization_id",
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Authentication failed" }, { status: 500 });
  }

  return redirect(`/dashboard`);
}

async function createClerkSupabaseClient() {
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
