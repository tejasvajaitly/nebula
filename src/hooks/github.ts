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
