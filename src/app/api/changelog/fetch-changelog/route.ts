import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

async function createClerkSupabaseClientSsr() {
  const { getToken } = await auth();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await getToken({
            template: "supabase",
          });

          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);

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
  const repoId = searchParams.get("repo_id");

  if (!repoId) {
    return Response.json({ error: "Missing repository ID" }, { status: 400 });
  }

  const client = await createClerkSupabaseClientSsr();

  try {
    const { data: changelogs, error } = await client
      .from("changelogs")
      .select("*")
      .eq("github_repository_id", repoId)
      .order("commit_date", { ascending: false });

    if (error) {
      return Response.json(
        { error: "Failed to fetch changelogs" },
        { status: 500 }
      );
    }

    return Response.json([...changelogs], { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
