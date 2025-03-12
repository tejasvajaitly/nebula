"use client";

import Tiptap from "@/components/editor/tiptap";
import { JSONContent } from "@tiptap/react";
import { useState } from "react";

export default function Page() {
  const [content, setContent] = useState<JSONContent | null>(null);
  return (
    <div className="px-4 pb-20 pt-32 sm:pb-40 sm:pt-48">
      <Tiptap onChange={setContent} />
    </div>
  );
}
