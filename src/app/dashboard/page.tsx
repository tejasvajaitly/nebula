"use client";
import { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
    // const { user } = useUser();
    const [githubAccount, setGithubAccount] = useState(null);

    // useEffect(() => {
    //     async function fetchGitHubStatus() {
    //         const response = await fetch(`/api/github-integration/status?clerk_user_id=${user?.id}`);
    //         const data = await response.json();
    //         if (data.connected) {
    //             setGithubAccount(data.github_username);
    //         }
    //     }

    //     if (user) fetchGitHubStatus();
    // }, [user]);

    const connectGitHub = () => {
        window.location.href = "/api/github-integration/start"; // Redirects to GitHub OAuth
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            {/* <h1 className="text-2xl font-semibold mb-4">Welcome, {user?.fullName}!</h1> */}
            {githubAccount ? (
                <p>✅ GitHub Connected: {githubAccount}</p>
            ) : (
                <button onClick={connectGitHub} className="bg-gray-800 text-white p-2">
                    Connect GitHub
                </button>
            )}
        </div>
    );
}