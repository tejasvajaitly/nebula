import { createClerkSupabaseClient } from "@/utils/supabase";
import { getUserProfiles } from "@/utils/github";

type GitHubSession = {
  session_key: string;
};

export async function GET() {
  const supabase = await createClerkSupabaseClient();
  try {
    const { data, error } = (await supabase
      .from("github_sessions")
      .select("session_key")) as {
      data: GitHubSession[];
      error: Error | null;
    };
    const tokens: string[] = data.map((obj) => obj.session_key);
    const profiles = await getUserProfiles(tokens);
    return new Response(JSON.stringify(profiles), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Error fetching user's github profiles" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
