import { Octokit } from "@octokit/rest";
// import { createClient } from "@supabase/supabase-js";
// import { currentUser } from "@clerk/nextjs";

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        return Response.json({ error: "No OAuth code provided" }, { status: 400 });
    }

    // Exchange OAuth code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
        return Response.json({ error: "Failed to get access token" }, { status: 401 });
    }

    // Fetch GitHub User Data
    const octokit = new Octokit({ auth: tokenData.access_token });
    const { data: user } = await octokit.rest.users.getAuthenticated();

    // Store in Supabase (Linked to Clerk User)
    // const clerkUser = await currentUser();
    // if (clerkUser) {
    //     await supabase.from("github_tokens").upsert([
    //         {
    //             clerk_user_id: clerkUser.id,
    //             github_user_id: user.id.toString(),
    //             github_username: user.login,
    //             access_token: tokenData.access_token,
    //         },
    //     ]);
    // }

    return Response.redirect(`http://localhost:3000/dashboard`);
}