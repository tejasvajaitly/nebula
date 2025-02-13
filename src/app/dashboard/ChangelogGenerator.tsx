"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChangelogGenerator({
  repoId,
  repoName,
  repoOwner,
  githubAccoutId,
}: {
  repoId: string;
  repoName: string;
  repoOwner: string;
  githubAccoutId: string;
}) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [changelog, setChangelog] = useState("");
  const [loading, setLoading] = useState(false);

  const generateChangelog = async () => {
    setLoading(true);
    setChangelog("");

    // Step 1: Fetch commits from GitHub
    const commitResponse = await fetch(
      `/api/changelog/fetchCommits?repo_id=${repoId}&repo_name=${repoName}&repo_owner=${repoOwner}&date_from=${dateFrom}&date_to=${dateTo}&github_account_id=${githubAccoutId}`
    );
    const commitData = await commitResponse.json();

    if (!commitData.commitMessages) {
      setChangelog("Failed to fetch commits.");
      setLoading(false);
      return;
    }

    // Step 2: Send commit messages to OpenAI for summarization
    const aiResponse = await fetch("/api/changelog/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commitMessages: commitData.commitMessages }),
    });
    const aiData = await aiResponse.json();

    setChangelog(aiData.changelog || "AI failed to generate changelog.");
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Generate Changelog</h2>
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={generateChangelog}
        className="bg-blue-500 text-white p-2 w-full"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Changelog"}
      </button>
      {changelog && (
        <>
          <div className="mt-4 border p-4">
            <h3 className="text-lg font-semibold">Changelog</h3>
            <pre className="whitespace-pre-wrap">{changelog}</pre>
          </div>
        </>
      )}
      <Markdown className="markdown" remarkPlugins={[remarkGfm]}>
        {changelog}
      </Markdown>
    </div>
  );
}
