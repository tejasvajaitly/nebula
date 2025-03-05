import { useQuery, useQueries } from "@tanstack/react-query";

export function useGithubProfiles() {
  return useQuery({
    queryKey: ["github", "profiles"],
    queryFn: async () => {
      const response = await fetch("/api/github-integration/user-profiles");
      if (!response.ok) {
        throw new Error("Failed to fetch Github profiles");
      }
      const data = await response.json();

      return data;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useGitHubRepositories(userId: string | undefined) {
  return useQuery({
    queryKey: ["github", "repos", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("No user ID provided");
      }
      const response = await fetch(
        `/api/github-integration/repository?accountId=${userId}`
      );
      return response.json();
    },
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
}
