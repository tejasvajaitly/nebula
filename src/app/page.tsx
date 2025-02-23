"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/theme-button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Particles } from "@/components/magicui/particles";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

function Page() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  const { organization } = useOrganization();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (organization) {
      // Invalidate queries when organization changes
      queryClient.invalidateQueries(); // You can also specify keys if needed
    }
  }, [organization, queryClient]);

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  return (
    <div className="relative flex h-screen w-full flex-col  overflow-hidden rounded-lg bg-background">
      <header className="flex flex-row items-center justify-between p-4 ">
        <Image
          src="/logo.svg"
          className="dark:invert"
          alt="Nebula logo"
          width={30}
          height={30}
          priority
        />
        <div className="flex items-center gap-4">
          <ModeToggle />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <span className="pointer-events-none z-10 whitespace-pre-wrap text-center text-8xl font-semibold leading-none pt-48">
        Nebula
      </span>
      <span className="pointer-events-none z-10 whitespace-pre-wrap text-center text-2xl font-semibold leading-none pt-4">
        The AI-powered changelog generator
      </span>
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
}

export default Page;
