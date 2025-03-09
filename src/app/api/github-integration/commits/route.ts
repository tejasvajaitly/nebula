import { getUserCommits } from "@/utils/github";
import { getGithubSessionToken } from "@/utils/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileID = searchParams.get("githubProfileId");
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!profileID || !owner || !repo) {
    return Response.json({
      error: "Something went wrong while fetching repository commits!",
    });
  }

  const token = await getGithubSessionToken(profileID);
  const repositories = await getUserCommits(token.session_key, owner, repo);
  return Response.json(repositories);
}
