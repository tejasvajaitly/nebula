"use client";
import Tiptap from "@/components/editor/tiptap";
import { ModeToggle } from "@/components/mode-toggle";
import { useEffect, useState } from "react";
import { JSONContent } from "@tiptap/react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function Page() {
  const [content, setContent] = useState<JSONContent | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const connectGitHub = () => {
    window.location.href = "/api/github-integration/start";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="fixed top-8 z-50 w-full">
        <div className="mx-auto w-full max-w-screen-lg px-4">
          <div
            className={`flex w-full items-center justify-between rounded-xl border transition-all duration-200 ease-out px-2 ${
              isScrolled
                ? "border-neutral-900 bg-neutral-950/80 backdrop-blur-sm"
                : "border-transparent bg-transparent backdrop-blur-0"
            }`}
          >
            <div className="flex w-full items-center justify-between p-2">
              <a href="#" className="p-1">
                <span className="sr-only">Motion Agent</span>
                <svg
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 70 70"
                  aria-label="MP Logo"
                  width="70"
                  height="70"
                  className="h-8 w-auto text-white"
                  fill="none"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="3"
                    d="M51.883 26.495c-7.277-4.124-18.08-7.004-26.519-7.425-2.357-.118-4.407-.244-6.364 1.06M59.642 51c-10.47-7.25-26.594-13.426-39.514-15.664-3.61-.625-6.744-1.202-9.991.263"
                  ></path>
                </svg>
              </a>
              <div className="flex gap-x-6 pr-6 sm:gap-x-12">
                <ModeToggle />
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-20 pt-32 sm:pb-40 sm:pt-48">
        <ModeToggle />
        <Button onClick={connectGitHub} className="w-full flex gap-2">
          <Github className="w-4 h-4" />
          Connect GitHub
        </Button>
        <p>set a baseline date or commit for tracking changelog</p>
        <Button>Create a new changelog</Button>
        <header className="flex justify-end items-center p-4 gap-4 h-16">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <Tiptap onChange={setContent} />
      </div>
    </div>
  );
}
