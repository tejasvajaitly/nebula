"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import OrganizationProfile from "./organization-profile";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CloudAlert, Github } from "lucide-react";
import ConnectGithubButton from "./connect-github-button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useUser,
  useOrganizationList,
  useAuth,
  useOrganization,
} from "@clerk/nextjs";
import { Spinner } from "@/components/21dev/spinner";
import GithubProfile from "./github-profile";
import SelectRepo from "./select-repo";

export type OnboardingStep = 1 | 2 | 3;

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
    enabled: !!userId,
  });
}

export default function Page() {
  const [activeOnboardingStep, setActiveOnboardingStep] =
    useState<OnboardingStep>(1);

  const [selectedGitHubAccountId, setSelectedGitHubAccountId] = useState<
    string | undefined
  >(undefined);

  const [selectedRepo, setSelectedRepo] = useState<any | undefined>(undefined);

  const { isLoaded: isCurrentOrgLoaded, organization: currentOrg } =
    useOrganization();

  const { data, isLoading, isError, refetch } = useGithubProfiles();

  const {
    data: repoList,
    isLoading: repoListLoading,
    isError: repoListError,
  } = useGitHubRepositories(selectedGitHubAccountId);

  useEffect(() => {
    if (selectedGitHubAccountId) {
      setActiveOnboardingStep(3);
      return;
    }
    if (data?.length === 1) {
      setSelectedGitHubAccountId(data[0].id);
      setActiveOnboardingStep(3);
      return;
    }
    if (currentOrg) {
      setActiveOnboardingStep(2);
      return;
    }
  }, [selectedGitHubAccountId, data, currentOrg]);

  if (!isCurrentOrgLoaded || isLoading) {
    return (
      <div className="flex  justify-center items-center h-screen w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center w-[450px] gap-4">
      <div className="w-full flex flex-row justify-start items-center">
        <Image
          src="/logo.svg"
          className="dark:invert"
          alt="Nebula logo"
          width={30}
          height={30}
          priority
        />
      </div>

      <div className="w-full flex flex-col justify-start items-start">
        <p className="text-2xl font-extrabold">Hello</p>
        <p className="text-muted-foreground">
          Let's set up your first changelog
        </p>
      </div>
      <OrganizationProfile
        activeOnboardingStep={activeOnboardingStep}
        setActiveOnboardingStep={setActiveOnboardingStep}
      />
      <GithubProfile
        activeOnboardingStep={activeOnboardingStep}
        setActiveOnboardingStep={setActiveOnboardingStep}
        selectedGitHubAccountId={selectedGitHubAccountId}
        setSelectedGitHubAccountId={setSelectedGitHubAccountId}
        data={data}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
      />
      <GenerateChangelog
        activeOnboardingStep={activeOnboardingStep}
        setActiveOnboardingStep={setActiveOnboardingStep}
        repoList={repoList}
        repoListLoading={repoListLoading}
        repoListError={repoListError}
        selectedRepo={selectedRepo}
        setSelectedRepo={setSelectedRepo}
      />

      <div className="w-full flex flex-row justify-start items-center gap-2 mt-8">
        <p className="text-muted-foreground text-sm">Need help?</p>
        <Link
          className="text-primary text-sm"
          href="mailto:tejasvajaitly@gmail.com"
        >
          Contact support
        </Link>
      </div>
    </div>
  );
}

function GenerateChangelog({
  activeOnboardingStep,
  setActiveOnboardingStep,
  repoList,
  repoListLoading,
  repoListError,
  selectedRepo,
  setSelectedRepo,
}: {
  activeOnboardingStep: OnboardingStep;
  setActiveOnboardingStep: (step: OnboardingStep) => void;
  repoList: any;
  repoListLoading: boolean;
  repoListError: boolean;
  selectedRepo: any;
  setSelectedRepo: (repo: any) => void;
}) {
  return (
    <Card
      onClick={() => setActiveOnboardingStep(3)}
      className={`w-full text-sm cursor-pointer ${
        activeOnboardingStep === 3
          ? "border border-neutral-950 dark:border-neutral-50"
          : ""
      }`}
    >
      <CardHeader>
        <CardTitle>3. Generate Changelog</CardTitle>
        <CardDescription>
          We will generate a changelog for you based on your repositories
        </CardDescription>
      </CardHeader>
      {activeOnboardingStep === 3 && (
        <>
          <CardContent>
            {/* <SelectRepo
              setSelectedRepo={setSelectedRepo}
              repoList={repoList}
              selectedRepo={selectedRepo}
            /> */}
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
