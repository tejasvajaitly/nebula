"use client";

import OrgCard from "./org-card";
import GithubCard from "./github-card";
import ChangelogCard from "./changelog-card";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { useGithubProfiles } from "@/hooks/github";
import { Spinner } from "@/components/21dev/spinner";

export default function Page() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeGithubProfile, setActiveGithubProfile] = useState<
    string | undefined
  >(undefined);

  const { data: githubProfiles, isPending: githubProfilesIsPending } =
    useGithubProfiles();

  const { isLoaded: isActiveOrgLoaded, organization: activeOrg } =
    useOrganization();

  useEffect(() => {
    if (activeGithubProfile) {
      setActiveStep(3);
      return;
    }
    if (githubProfiles?.length >= 1) {
      setActiveGithubProfile(githubProfiles[0].id.toString());
      setActiveStep(3);
      return;
    }
    if (activeOrg) {
      setActiveStep(2);
      return;
    }
  }, [activeGithubProfile, githubProfiles, activeOrg]);

  if (!isActiveOrgLoaded || githubProfilesIsPending) {
    return (
      <div className="flex  justify-center items-center h-screen w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center w-full sm:w-[450px] gap-4">
      <Header />
      <OrgCard activeStep={activeStep} setActiveStep={setActiveStep} />
      <GithubCard
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        activeGithubProfile={activeGithubProfile}
        setActiveGithubProfile={setActiveGithubProfile}
      />
      <ChangelogCard
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        activeGithubProfile={activeGithubProfile}
      />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <>
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
    </>
  );
}

function Footer() {
  return (
    <div className="w-full flex flex-row justify-start items-center gap-2 mt-8">
      <p className="text-muted-foreground text-sm">Need help?</p>
      <Link
        className="text-primary text-sm"
        href="mailto:tejasvajaitly@gmail.com"
      >
        Contact support
      </Link>
    </div>
  );
}
