import { useQuery } from "@tanstack/react-query";

export function useGithubProfiles() {
  return useQuery({
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
  return useQuery({
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
    throw new Error(errorMessage.error || "Failed to fetch repositories");
  }
  return response.json();
}
