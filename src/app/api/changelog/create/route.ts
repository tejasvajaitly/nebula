import {
  updateChangelog,
  getGithubSessionToken,
  createChangelogProject,
} from "@/utils/supabase";
import { generateChangelog } from "@/utils/openai";
import { getUserCommitsSince } from "@/utils/github";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { owner, repo, repoId, baselineDate, profileID } = body;
    if (!profileID || !owner || !repo || !baselineDate || !repoId) {
      throw new Error();
    }

    await createChangelogProject(repo, repoId);
    const token = await getGithubSessionToken(profileID);
    const commits = await getUserCommitsSince(
      token.session_key,
      owner,
      repo,
      baselineDate
    );
    const changelog = await generateChangelog(commits);

    const latestCommitSha = commits[0].sha;
    const latestCommitDate =
      commits[0].commit.committer?.date || commits[0].commit.author?.date;

    if (!latestCommitSha || !latestCommitDate || !changelog) {
      throw new Error("select another commit");
    }
    await updateChangelog(repoId, changelog, latestCommitSha, latestCommitDate);

    const { userId } = await auth();
    if (!userId) {
      throw new Error("not authenticated");
    }
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "something went wrong" }, { status: 400 });
  }
}
