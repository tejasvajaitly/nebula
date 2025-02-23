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
import { useState } from "react";

type OnboardingStep = 1 | 2 | 3;

export default function Page() {
  const [activeOnboardingStep, setActiveOnboardingStep] =
    useState<OnboardingStep>(1);
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
      />
      <GenerateChangelog
        activeOnboardingStep={activeOnboardingStep}
        setActiveOnboardingStep={setActiveOnboardingStep}
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

function OrganizationProfile({
  activeOnboardingStep,
  setActiveOnboardingStep,
}: {
  activeOnboardingStep: OnboardingStep;
  setActiveOnboardingStep: (step: OnboardingStep) => void;
}) {
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
          We need to know which organization you want to use to track changelogs
        </CardDescription>
      </CardHeader>
      {activeOnboardingStep === 1 && (
        <>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

function GithubProfile({
  activeOnboardingStep,
  setActiveOnboardingStep,
}: {
  activeOnboardingStep: OnboardingStep;
  setActiveOnboardingStep: (step: OnboardingStep) => void;
}) {
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
          We need access to your Github to get your repositories
        </CardDescription>
      </CardHeader>
      {activeOnboardingStep === 2 && (
        <>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

function GenerateChangelog({
  activeOnboardingStep,
  setActiveOnboardingStep,
}: {
  activeOnboardingStep: OnboardingStep;
  setActiveOnboardingStep: (step: OnboardingStep) => void;
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
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
