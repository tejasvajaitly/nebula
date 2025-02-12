"use client";
import { useEffect, useState } from "react";
import ChangelogGenerator from "../components/ChangelogGenerator";

import { useSession, useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

export default function Dashboard() {
  const { user } = useUser();
  const [githubSessions, setGithubSessions] = useState<any[]>([]);
  const [githubUsers, setGithubUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useSession();
  const [repoId, setRepoId] = useState<string>("");
  const [repoName, setRepoName] = useState<string>("");
  const [repoOwner, setRepoOwner] = useState<string>("");
  const [githubAccoutId, setGithubAccoutId] = useState<string>("");

  // Create Supabase client with Clerk JWT authentication
  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({
              template: "supabase",
            });
            const headers = new Headers(options?.headers);
            console.log("clerkToken", clerkToken);
            headers.set("Authorization", `Bearer ${clerkToken}`);
            return fetch(url, { ...options, headers });
          },
        },
      }
    );
  }

  const client = createClerkSupabaseClient();

  // Fetch GitHub sessions for the logged-in organization
  useEffect(() => {
    if (!user) return;

    async function loadGithubSessions() {
      setLoading(true);
      const { data, error } = await client.from("github_sessions").select("*");

      console.log("data", data);
      if (!error) fetchAllGithubUserDetails(data);
      if (!error) setGithubSessions(data);
      setLoading(false);
    }

    loadGithubSessions();
  }, [user]);

  async function fetchAllGithubUserDetails(accessTokens: any) {
    setLoading(true);
    const userDetailsPromises = accessTokens.map(async (token: any) => {
      const userDetails = await fetchGithubUserDetails(token.session_key);
      const userRepos = await fetchGithubUserRepos(token.session_key);
      return { ...userDetails, repos: userRepos };
    });

    try {
      const users = await Promise.all(userDetailsPromises);
      setGithubUsers(users);
      console.log("users", users);
    } catch (error) {
      console.error("Error fetching GitHub user details:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchGithubUserDetails(accessToken: string) {
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching GitHub user details:", error);
      return null;
    }
  }

  async function fetchGithubUserRepos(accessToken: string) {
    try {
      const response = await fetch("https://api.github.com/user/repos", {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching GitHub user repositories:", error);
      return [];
    }
  }

  const connectGitHub = () => {
    window.location.href = "/api/github-integration/start"; // Redirects to GitHub OAuth
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome, {user?.fullName}!
      </h1>

      {githubUsers.map((user) => (
        <div key={user.id}>
          <p>{user.login}</p>
          <img
            className="w-10 h-10 rounded-full"
            src={user.avatar_url}
            alt="avatar"
          />
          <ul>
            {user?.repos?.map((repo: any) => (
              <li
                className={`cursor-pointer hover:text-blue-500 hover:underline hover:font-bold ${
                  repoId === repo.id ? "bg-yellow-200" : ""
                }`}
                key={repo.id}
                onClick={() => {
                  setRepoId(repo.id);
                  setRepoName(repo.name);
                  setRepoOwner(user.login);
                  setGithubAccoutId(user.id);
                }}
              >
                {repo.name}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button onClick={connectGitHub} className="bg-gray-800 text-white p-2">
        Add GitHub Account
      </button>

      <ChangelogGenerator
        githubAccoutId={githubAccoutId}
        repoId={repoId}
        repoName={repoName}
        repoOwner={repoOwner}
      />
    </div>
  );
}
