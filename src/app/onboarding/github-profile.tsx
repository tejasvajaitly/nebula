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
import { Check, CloudAlert, Github, RotateCcw } from "lucide-react";
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
import { OnboardingStep } from "./page";
export default function GithubProfile({
  activeOnboardingStep,
  setActiveOnboardingStep,
  selectedGitHubAccountId,
  setSelectedGitHubAccountId,
  data,
  isLoading,
  isError,
  refetch,
}: {
  activeOnboardingStep: OnboardingStep;
  setActiveOnboardingStep: (step: OnboardingStep) => void;
  selectedGitHubAccountId: string | undefined;
  setSelectedGitHubAccountId: (id: string) => void;
  data: any;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}) {
  useEffect(() => {
    if (data?.length === 1) {
      setSelectedGitHubAccountId(data[0].id);
      setActiveOnboardingStep(3);
    }
  }, [data]);

  if (isLoading) {
    return (
      <Card className="w-full text-sm">
        <CardHeader>
          <CardTitle className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-4">
              <p>2. Connect your Github</p>
              <Skeleton className="w-16 h-4" />
            </div>

            <Skeleton className="w-6 h-6 rounded-full" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-6" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full text-sm">
        <CardHeader>
          <CardTitle className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-4">
              <p>2. Connect your Github</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-row justify-start items-center gap-2 text-destructive">
            <p>Error fetching Github profiles</p>
            <CloudAlert className="w-4 h-4" />
          </div>

          <Button className="w-full flex flex-row gap-2" onClick={refetch}>
            <RotateCcw className="w-4 h-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (data?.length === 0) {
    return (
      <Card
        onClick={() => setActiveOnboardingStep(2)}
        className={`w-full text-sm cursor-pointer ${
          activeOnboardingStep === 2
            ? "border border-neutral-950 dark:border-neutral-50"
            : ""
        }`}
      >
        <CardHeader>
          <CardTitle>2. Connect your Github</CardTitle>
          <CardDescription>
            We need access to your Github to read your repository commits.
          </CardDescription>
        </CardHeader>
        {activeOnboardingStep === 2 && (
          <>
            <CardContent>
              <ConnectGithubButton />
            </CardContent>
          </>
        )}
      </Card>
    );
  }

  return (
    <Card
      onClick={() => setActiveOnboardingStep(2)}
      className={`w-full text-sm cursor-pointer ${
        activeOnboardingStep === 2
          ? "border border-neutral-950 dark:border-neutral-50"
          : ""
      }`}
    >
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-4">
            <p>
              2. {selectedGitHubAccountId ? "Connected" : "Connect your"} GitHub
              account
            </p>

            {selectedGitHubAccountId && (
              <Badge className="flex gap-2">
                <Github width={16} height={16} />
                {
                  data?.find(
                    (profile: any) => profile.id === selectedGitHubAccountId
                  )?.login
                }
              </Badge>
            )}
          </div>

          {selectedGitHubAccountId && (
            <div className="top-0 right-0 rounded-full bg-green-600 dark:bg-green-500 text-white dark:text-zinc-950 p-0.5">
              <Check width={14} height={14} />
            </div>
          )}
        </CardTitle>
        <CardDescription>So we can access your repository.</CardDescription>
      </CardHeader>

      {activeOnboardingStep === 2 && (
        <>
          <CardContent>
            <Select
              onValueChange={(value) => {
                setSelectedGitHubAccountId(value);
                setActiveOnboardingStep(3);
              }}
              value={selectedGitHubAccountId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a GitHub account from the list" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {data?.map((account: any) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.login}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>

          <CardContent>
            <CardDescription>OR</CardDescription>
          </CardContent>

          <CardFooter>
            <ConnectGithubButton />
          </CardFooter>
        </>
      )}
    </Card>
  );
}
