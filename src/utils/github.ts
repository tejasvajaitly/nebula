import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { Octokit } from "@octokit/rest";

type GitHubUser =
  RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"];

async function getUserProfile(token: string) {
  const octokit = new Octokit({
    auth: token,
  });

  const userResponse = await octokit.rest.users.getAuthenticated();
  const userProfile: GitHubUser = userResponse.data;
  return userProfile;
}
