"use client";

// Example page component
import React, { useState } from "react";
import { LexicalEditor } from "./MarkdownEditor";

export default function ChangelogPage() {
  const [markdown, setMarkdown] = useState<string>("");

  // Here you would add your AI generation logic
  const generateChangelog = async () => {
    // Mock AI response for demonstration
    const aiGeneratedChangelog = `# Release v1.0.0
    
## New Features
- Added user authentication
- Implemented dashboard analytics
- Created new reporting module

## Bug Fixes
- Fixed login redirect issue
- Resolved data loading performance problem
- Corrected alignment in mobile views
`;

    setMarkdown(aiGeneratedChangelog);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Changelog Generator</h1>

      <div className="mb-4">
        <button
          onClick={generateChangelog}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate Changelog with AI
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Editor</h2>
          <LexicalEditor>{markdown}</LexicalEditor>
        </div>
      </div>
    </div>
  );
}
