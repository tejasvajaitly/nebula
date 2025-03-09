import { Octokit } from "@octokit/rest";

export async function getUserProfile(token: string) {
  const octokit = new Octokit({
    auth: token,
  });

  const userResponse = await octokit.rest.users.getAuthenticated();
  const userProfile = userResponse.data;
  return userProfile;
}

export async function getUserProfiles(tokens: string[]) {
  const userProfilesPromises = tokens.map((token) => getUserProfile(token));
  const userProfiles = await Promise.all(userProfilesPromises);
  return userProfiles;
}

export async function getUserRepositories(token: string) {
  const octokit = new Octokit({
    auth: token,
  });

  const repositories = await octokit.paginate(
    octokit.rest.repos.listForAuthenticatedUser,
    {
      per_page: 100,
    }
  );

  return repositories;
}

export async function getUserCommits(
  token: string,
  owner: string,
  repo: string
) {
  const octokit = new Octokit({
    auth: token,
  });

  const commits = await octokit.paginate(octokit.rest.repos.listCommits, {
    owner,
    repo,
    per_page: 100,
  });

  return commits;
}
