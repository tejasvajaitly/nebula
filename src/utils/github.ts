import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { Octokit } from "@octokit/rest";

type GitHubUser =
  RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"];

export async function getUserProfile(token: string) {
  const octokit = new Octokit({
    auth: token,
  });

  const userResponse = await octokit.rest.users.getAuthenticated();
  const userProfile: GitHubUser = userResponse.data;
  return userProfile;
}

export async function getUserProfiles(tokens: string[]) {
  const userProfilesPromises = tokens.map((token) => getUserProfile(token));
  const userProfiles: GitHubUser[] = await Promise.all(userProfilesPromises);
  return userProfiles;
}
