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

export default function Page() {
  const [content, setContent] = useState<JSONContent | null>(null);

  return (
    <div>
      Dashboard
      <ModeToggle />
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
