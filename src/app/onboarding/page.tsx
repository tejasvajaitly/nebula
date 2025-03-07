"use client";

import OrgCard from "./org-card";
import GithubCard from "./github-card";
import ChangelogCard from "./changelog-card";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [activeStep, setActiveStep] = useState<number>(1);
  return (
    <div className="flex flex-col justify-start items-center w-full sm:w-[450px] gap-4">
      <Header />
      <OrgCard activeStep={activeStep} setActiveStep={setActiveStep} />
      <GithubCard activeStep={activeStep} setActiveStep={setActiveStep} />
      <ChangelogCard activeStep={activeStep} setActiveStep={setActiveStep} />
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
