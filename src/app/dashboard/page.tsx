"use client";
import Tiptap from "@/components/editor/tiptap";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { JSONContent } from "@tiptap/react";

export default function Page() {
  const [content, setContent] = useState<JSONContent | null>(null);

  return (
    <div>
      Dashboard
      <ModeToggle />
      <Tiptap onChange={setContent} />
    </div>
  );
}
