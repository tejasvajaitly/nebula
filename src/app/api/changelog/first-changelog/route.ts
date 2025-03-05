import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function createClerkSupabaseClientSsr() {
  // The `useAuth()` hook is used to access the `getToken()` method
  const { getToken, sessionClaims } = await auth();

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
  const client = await createClerkSupabaseClientSsr();
  const url = new URL(req.url);
  const repoId = url.searchParams.get("repo_id");
  const githubAccountId = url.searchParams.get("github_account_id");

  const res = await client.from("changelog_sites").insert({
    github_repository_id: repoId,
    repository_name: "test",
  });

  const commits = await fetchCommits(url);

  if (!commits) {
    return Response.json(
      { error: "Failed to fetch commits." },
      { status: 400 }
    );
  }
  console.log("commits", commits);

  const latestCommit = commits[0];
  console.log("latestCommit", latestCommit);
  const latestCommitSha = latestCommit.sha;
  const latestCommitDate = latestCommit.commit.author.date;

  const prompt = `Limit prose. Be extremely concise.
    Write a short and professional but fun changelog.
    The structure of the changelog you write should include category headings such as "Features", "Improvements", "Highlights" and "Bug Fixes". This is important.
    Under each category, summarize the most important changes in bullet points. This is important, don't halucinate this.
    Make sure each section contains bullet points relevant to the category, ignore code improvements. Highlight the heading if there are mutiple bullet points make them a list with proper markdown bullets syntax. Your points should be related to whats important to a user not the developers. This is important. 
    Write in markdown. Ignore numbers, IDs, and timestamps. Keep it light.
    Limit prose.:\n\n${commits}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a changelog generator." },
        { role: "user", content: prompt },
      ],
    });

    console.log("response from openai", completion.choices[0].message.content);

    const { error } = await client.from("changelogs").insert([
      {
        github_repository_id: repoId,
        description: completion.choices[0].message.content,
        git_commit_sha: latestCommitSha,
        commit_date: latestCommitDate,
      },
    ]);

    console.log("Eror from supabase while saving", error);

    if (error) {
      return Response.json(
        { error: "Failed to insert changelog in database" },
        { status: 500 }
      );
    }

    return Response.json(
      { changelog: completion.choices[0].message.content },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
    return Response.json({ error: "OpenAI request failed" }, { status: 500 });
  }
}

async function fetchCommits(url: URL) {
  const repoId = url.searchParams.get("repo_id");
  const repoName = url.searchParams.get("repo_name");
  const repoOwner = url.searchParams.get("repo_owner");
  const dateFrom = url.searchParams.get("date_from");
  const githubAccountId = url.searchParams.get("github_account_id");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const commitResponse = await fetch(
    `${baseUrl}/api/changelog/fetchCommits?repo_id=${repoId}&repo_name=${repoName}&repo_owner=${repoOwner}&date_from=${dateFrom}&github_account_id=${githubAccountId}`
  );
  const commitData = await commitResponse.json();

  return commitData;
}
