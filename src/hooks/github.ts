import { useQuery } from "@tanstack/react-query";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

type GitHubUser =
  RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"];

type Repositories =
  RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]["response"]["data"];

type Commits =
  RestEndpointMethodTypes["repos"]["listCommits"]["response"]["data"];

export function useGithubProfiles() {
  return useQuery<GitHubUser[]>({
    queryKey: ["github", "profiles"],
    queryFn: fetchProfile,
    retry: 1,
  });
}

async function fetchProfile() {
  const response = await fetch("/api/github-integration/user-profiles");
  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.error || "Failed to fetch profiles");
  }
  return response.json();
}

export function useGithubRepositories(activeGithubProfile: string | undefined) {
  return useQuery<Repositories>({
    queryKey: ["github", "repositories", "profileId", activeGithubProfile],
    queryFn: () => fetchAllRepositories(activeGithubProfile),
    enabled: !!activeGithubProfile,
  });
}

async function fetchAllRepositories(activeGithubProfile: string | undefined) {
  if (!activeGithubProfile) throw new Error("Failed to fetch repositories");
  const response = await fetch(
    `/api/github-integration/repositories/?githubProfileId=${activeGithubProfile}`
  );
  if (!response.ok) {
    const errorMessage = await response.json();
    console.log("errorMessage", errorMessage);
    throw new Error(errorMessage.error || "Failed to fetch repositories");
  }
  return response.json();
}

export function useGithubCommits(
  activeGithubProfileID: number | undefined,
  activeGithubProfileLogin: string | undefined,
  activeRepository: string | undefined
) {
  return useQuery<Commits>({
    queryKey: [
      "github",
      "commits",
      activeGithubProfileID,
      activeGithubProfileLogin,
      activeRepository,
    ],
    queryFn: () =>
      fetchCommits(
        activeGithubProfileID,
        activeGithubProfileLogin,
        activeRepository
      ),
    enabled:
      !!activeGithubProfileID &&
      !!activeGithubProfileLogin &&
      !!activeRepository,
  });
}

async function fetchCommits(
  activeGithubProfileID: number | undefined,
  activeGithubProfileLogin: string | undefined,
  activeRepository: string | undefined
) {
  const response = await fetch(
    `/api/github-integration/commits?githubProfileId=${activeGithubProfileID}&owner=${activeGithubProfileLogin}&repo=${activeRepository}`
  );
  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.error || "Failed to fetch commits");
  }
  return response.json();
}
