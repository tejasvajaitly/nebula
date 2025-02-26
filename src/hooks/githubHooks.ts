import { useQuery } from "@tanstack/react-query";

export function useGithubProfiles() {
  return useQuery({
    queryKey: ["githubProfiles"],
    queryFn: async () => {
      const response = await fetch("/api/github-integration/user-profiles");
      if (!response.ok) {
        throw new Error("Failed to fetch Github profiles");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useGitHubRepositories(userId: string | undefined) {
  return useQuery({
    queryKey: ["repos", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(
        `/api/github-integration/repository?accountId=${userId}`
      );
      return response.json();
    },
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
}
