import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const repo_owner = searchParams.get("repo_owner");
    const repo_name = searchParams.get("repo_name");
    const date_from = searchParams.get("date_from");
    const date_to = searchParams.get("date_to");

    if (!repo_owner || !repo_name || !date_from || !date_to) {
        return Response.json({ error: "Missing required parameters" }, { status: 400 });
    }

    try {
        const { data: commits } = await octokit.request(`GET /repos/${repo_owner}/${repo_name}/commits`, {
            since: `${date_from}T00:00:00Z`,
            until: `${date_to}T23:59:59Z`
        });

        const commitMessages = commits.map((commit: any) => `- ${commit.commit.message}`).join("\n");

        return Response.json({ commitMessages });
    } catch (error) {
        return Response.json({ error: "Failed to fetch commits" }, { status: 500 });
    }
}