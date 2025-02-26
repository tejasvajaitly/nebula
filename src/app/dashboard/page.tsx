"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function useGithubProfiles() {
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

function useGitHubRepositories(userId: string | undefined) {
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
    enabled: false,
  });
}

function Page() {
  const [changelog, setChangelog] = useState("");
  const { organization } = useOrganization();
  const queryClient = useQueryClient();

  const {
    data: githubProfiles,
    isLoading: githubProfilesLoading,
    isError: githubProfilesError,
    refetch: githubProfilesRefetch,
  } = useGithubProfiles();

  const {
    data: githubRepositories,
    isLoading: githubRepositoriesLoading,
    isError: githubRepositoriesError,
    refetch: githubRepositoriesRefetch,
  } = useGitHubRepositories(githubProfiles?.[0]?.id);

  // Fetch changelogs using TanStack Query
  const {
    data,
    error,
    isLoading,
    refetch: changelogRefetch,
  } = useQuery({
    queryKey: ["changelogs", githubRepositories?.repos[19].id],
    queryFn: async () => {
      const response = await fetch(
        `/api/changelog/fetch-changelog?repo_id=${githubRepositories?.repos[19].id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch changelogs");
      }
      return response.json();
    },
    enabled: !!githubRepositories?.repos[19].id, // Only run the query if organization ID is available
  });

  useEffect(() => {
    if (organization) {
      // Invalidate queries when organization changes
      queryClient.invalidateQueries(); // You can also specify keys if needed
    }
  }, [organization, queryClient]);

  useEffect(() => {
    if (data) {
      setChangelog(
        data.changelogs.map((log: any) => log.description).join("\n\n")
      );
    }
  }, [data]);

  return (
    <div className="flex flex-row justify-between items-start gap-28">
      <Card className="h-[600px] overflow-y-auto w-[800px] ">
        <CardHeader>
          <CardTitle>Changelog</CardTitle>
        </CardHeader>
        <CardContent className="bg-red-500 h-full">
          <Button onClick={() => githubProfilesRefetch()}>
            Fetch Github Profiles
          </Button>
          <Button onClick={() => githubRepositoriesRefetch()}>
            Fetch Github Repositories
          </Button>
          <Button onClick={() => changelogRefetch()}>Fetch Changelog</Button>

          {/* <div>{JSON.stringify(githubProfiles?.[0])}</div> */}

          <div className="mt-8 bg-red-700">
            {githubRepositories?.repos[19].name}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
