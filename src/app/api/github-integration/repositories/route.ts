import { getUserRepositories } from "@/utils/github";
import { getGithubSessionToken } from "@/utils/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileID = searchParams.get("githubProfileId");
  if (!profileID) {
    return Response.json({
      error: "Something went wrong while fetching users repositories!",
    });
  }
  const token = await getGithubSessionToken(profileID);
  const repositories = await getUserRepositories(token.session_key);
  return Response.json(repositories);
}
