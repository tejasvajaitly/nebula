"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OnboardingStep } from "./page";
import { Check } from "lucide-react";
import { Building } from "lucide-react";
import { useOrganizationList } from "@clerk/nextjs";
import { useOrganization } from "@clerk/nextjs";
import { UserMembershipParams } from "@/utils/organizations";
import CreateOrgForm from "./create-org-form";
import SelectOrg from "./select-org";

export default function OrganizationProfile({
  activeOnboardingStep,
  setActiveOnboardingStep,
}: {
  activeOnboardingStep: OnboardingStep;
  setActiveOnboardingStep: (step: OnboardingStep) => void;
}) {
  const { isLoaded: isOrgListLoaded, userMemberships } =
    useOrganizationList(UserMembershipParams);

  const { isLoaded: isCurrentOrgLoaded, organization: currentOrg } =
    useOrganization();

  if (!isOrgListLoaded || !isCurrentOrgLoaded) {
    return (
      <Card className="w-full text-sm">
        <CardHeader>
          <CardTitle className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-4">
              <p>1. Organization Profile</p>
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

  if (userMemberships.count === 0) {
    return (
      <Card
        onClick={() => setActiveOnboardingStep(1)}
        className={`w-full text-sm cursor-pointer ${
          activeOnboardingStep === 1
            ? "border border-neutral-950 dark:border-neutral-50"
            : ""
        }`}
      >
        <CardHeader>
          <CardTitle>1. Organization Profile</CardTitle>
          <CardDescription>
            You need to be a part of an org to continue.
          </CardDescription>
        </CardHeader>
        {activeOnboardingStep === 1 && (
          <CardContent>
            <CreateOrgForm setActiveOnboardingStep={setActiveOnboardingStep} />
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <Card
      onClick={() => setActiveOnboardingStep(1)}
      className={`w-full text-sm cursor-pointer ${
        activeOnboardingStep === 1
          ? "border border-neutral-950 dark:border-neutral-50"
          : ""
      }`}
    >
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-4">
            <p>1. Current organization</p>
            <Badge className="flex gap-2">
              <Building width={14} height={14} /> {currentOrg?.name}
            </Badge>
          </div>

          <div className="top-0 right-0 rounded-full bg-green-600 dark:bg-green-500 text-white dark:text-zinc-950 p-0.5">
            <Check width={14} height={14} />
          </div>
        </CardTitle>
        <CardDescription>
          You need to be a part of an org to continue.
        </CardDescription>
      </CardHeader>
      {activeOnboardingStep === 1 && (
        <>
          <CardContent>
            <SelectOrg />
          </CardContent>
          <CardContent>
            <CardDescription>OR</CardDescription>
          </CardContent>
          <CardFooter>
            <CreateOrgForm setActiveOnboardingStep={setActiveOnboardingStep} />
          </CardFooter>
        </>
      )}
    </Card>
  );
}
