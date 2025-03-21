import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { createOAuthUserAuth } from "@octokit/auth-oauth-user";
import { createClerkSupabaseClient } from "@/utils/supabase";
import { getUserProfile } from "@/utils/github";
import { redirect } from "next/navigation";

type GitHubUser =
  RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    redirect("/github-integration-error");
  }

  try {
    const auth = createOAuthUserAuth({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      code,
    });

    const { token } = await auth();

    const userProfile = await getUserProfile(token);

    const supabase = await createClerkSupabaseClient();
    await supabase.from("github_sessions").upsert(
      [
        {
          github_account_id: userProfile.id.toString(),
          session_key: token,
        },
      ],
      {
        onConflict: "github_account_id,organization_id",
      }
    );
  } catch (error) {
    redirect("/github-integration-error");
  }

  return redirect(`/dashboard`);
}
