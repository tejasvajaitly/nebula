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
import { Check, Github } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import { Spinner } from "@/components/21dev/spinner";
import GithubProfile from "./github-profile";
import SelectRepo from "./select-repo";
import { DatePicker } from "@/components/ui/date-picker";
import confetti from "canvas-confetti";
import { useGithubProfiles, useGitHubRepositories } from "@/hooks/githubHooks";

export type OnboardingStep = 1 | 2 | 3;

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
    refetch: repoListRefetch,
    isFetching: repoListIsFetching,
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
        repoListRefetch={repoListRefetch}
        repoListIsFetching={repoListIsFetching}
        selectedGitHubAccountId={selectedGitHubAccountId}
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
  setSelectedRepo,
  repoListRefetch,
  repoListIsFetching,
  selectedGitHubAccountId,
  selectedRepo,
}: {
  activeOnboardingStep: OnboardingStep;
  setActiveOnboardingStep: (step: OnboardingStep) => void;
  repoList: any;
  repoListLoading: boolean;
  repoListError: boolean;
  selectedRepo: any;
  setSelectedRepo: (repo: any) => void;
  repoListRefetch: () => void;
  repoListIsFetching: boolean;
  selectedGitHubAccountId: string | undefined;
}) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const fetchChangelog = async () => {
    const response = await fetch(
      `/api/changelog/generate?repo_id=${selectedRepo?.id}&repo_name=${
        selectedRepo?.name
      }&repo_owner=${
        selectedRepo?.owner.login
      }&date_from=${dateFrom?.toISOString()}&date_to=${dateTo?.toISOString()}&github_account_id=${selectedGitHubAccountId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch changelog");
    }

    const responseTwo = await fetch("/api/complete-onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!responseTwo.ok) {
      throw new Error("Failed to fetch changelog");
    }

    const data = await responseTwo.json();
    return data.changelog || "AI failed to generate changelog.";
  };

  const { isLoading, data, error, refetch, isFetching, isSuccess } = useQuery({
    queryKey: [
      "changelog",
      selectedRepo?.id,
      selectedRepo?.name,
      selectedRepo?.owner.login,
      dateFrom,
      dateTo,
      selectedGitHubAccountId,
    ],
    queryFn: fetchChangelog,
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
  }, [isSuccess]);

  if (isSuccess) {
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
          <CardTitle className="flex flex-row justify-between items-center">
            3. Generate Changelog{" "}
            <div className="top-0 right-0 rounded-full bg-green-600 dark:bg-green-500 text-white dark:text-zinc-950 p-0.5">
              <Check width={14} height={14} />
            </div>
          </CardTitle>
          <CardDescription>
            We will generate a changelog for you based on your repositories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard">
            <Button className="w-full">🎉 Go to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

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
          We will generate a changelog for you based on your repositories.
        </CardDescription>
      </CardHeader>
      {activeOnboardingStep === 3 && (
        <>
          <CardContent>
            <SelectRepo
              setSelectedRepo={setSelectedRepo}
              repoList={repoList}
              repoListLoading={repoListLoading}
              repoListError={repoListError}
              repoListRefetch={repoListRefetch}
              repoListIsFetching={repoListIsFetching}
            />
          </CardContent>
          <CardFooter className="flex flex-col justify-start items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Select a date range to generate the changelog.
            </p>
            <DatePicker date={dateFrom} setDate={setDateFrom} label="From" />
            <DatePicker date={dateTo} setDate={setDateTo} label="To" />
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              className="w-full flex flex-row gap-2 mt-2"
            >
              {isFetching ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <p>Generate Changelog</p>
              )}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
