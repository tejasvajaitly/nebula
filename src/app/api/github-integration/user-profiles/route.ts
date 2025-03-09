import { getAllGithubSessionTokens } from "@/utils/supabase";
import { getUserProfiles } from "@/utils/github";

export async function GET() {
  try {
    const data = await getAllGithubSessionTokens();
    const tokens: string[] = data.map((obj) => obj.session_key);
    const profiles = await getUserProfiles(tokens);
    return Response.json(profiles);
  } catch (error) {
    console.log(error);

    return Response.json(
      { error: "Error fetching user's github profiles" },
      { status: 400 }
    );
  }
}
