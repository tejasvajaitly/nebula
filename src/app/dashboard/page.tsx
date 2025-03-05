"use client";
import Tiptap from "@/components/editor/tiptap";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
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

  const connectGitHub = () => {
    window.location.href = "/api/github-integration/start";
  };

  return (
    <div>
      Dashboard
      <ModeToggle />
      <Button onClick={connectGitHub} className="w-full flex gap-2">
        <Github className="w-4 h-4" />
        Connect GitHub
      </Button>
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
  );
}
