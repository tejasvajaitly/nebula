"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useGithubProfiles, useGitHubRepositories } from "@/hooks/githubHooks";
import Editor from "@/lexical/editor";

function Page() {
  const [changelog, setChangelog] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedRepository, setSelectedRepository] = useState<any>(null);
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
  } = useGitHubRepositories(selectedProfile?.id);

  const {
    data: changelogData,
    error: changelogError,
    isLoading: changelogLoading,
    refetch: changelogRefetch,
  } = useQuery({
    queryKey: ["changelogs", selectedRepository?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/changelog/fetch-changelog?repo_id=${selectedRepository?.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch changelogs");
      }
      return response.json();
    },
    enabled: false, // Only run the query if organization ID is available
  });

  useEffect(() => {
    if (organization) {
      // Invalidate queries when organization changes
      queryClient.invalidateQueries(); // You can also specify keys if needed
    }
  }, [organization, queryClient]);

  useEffect(() => {
    if (changelogData) {
      setChangelog(
        changelogData.changelogs.map((log: any) => log.description).join("\n\n")
      );
    }
  }, [changelogData]);

  return (
    <div className="flex flex-col justify-between items-start gap-28 h-[500px] w-full rounded-md p-8">
      <Button onClick={() => changelogRefetch()}>Generate Changelog</Button>

      {changelogLoading && <p>Loading...</p>}
      {changelogError && <p>Error: {changelogError.message}</p>}

      <div>
        {githubProfiles?.map((profile: any) => (
          <div
            key={profile.id}
            onClick={() => setSelectedProfile(profile)}
            className={`cursor-pointer  p-2 rounded-md ${
              selectedProfile?.id === profile.id ? "bg-gray-100" : ""
            }`}
          >
            <h1>{profile.name}</h1>
            <p>{profile.url}</p>
          </div>
        ))}
      </div>
      {githubProfilesLoading && <p>Loading...</p>}
      {githubProfilesError && <p>Error: {githubProfilesError}</p>}
      <div>
        {githubRepositories &&
          githubRepositories?.repos.map((repo: any) => (
            <div
              key={repo.id}
              onClick={() => setSelectedRepository(repo)}
              className={`cursor-pointer  p-2 rounded-md ${
                selectedRepository?.id === repo.id ? "bg-gray-100" : ""
              }`}
            >
              <h1>{repo.name}</h1>
              <p>{repo.url}</p>
            </div>
          ))}
        {changelog && (
          <Editor
            initialContent={changelogData.changelogs
              .map((log: any) => log.description)
              .join("\n\n")}
          />
        )}
      </div>
    </div>
  );
}

export default Page;
