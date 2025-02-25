import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

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

  const userProfilesPromises = data?.map((session) => {
    return fetchUserProfile(session.session_key);
  });

  const userProfiles = await Promise.all(userProfilesPromises);

  const userProfilesJson = await Promise.all(
    userProfiles.map((user) => user.json())
  );

  return Response.json([...userProfilesJson], { status: 200 });
}

function fetchUserProfile(token: string) {
  return fetch("https://api.github.com/user", {
    headers: { Authorization: `token ${token}` },
  });
}
