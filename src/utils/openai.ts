import OpenAI from "openai";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

type Commits =
  RestEndpointMethodTypes["repos"]["listCommits"]["response"]["data"];

export async function generateChangelog(commits: Commits) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Limit prose. Be extremely concise.
Write a short and professional but fun changelog.
The structure of the changelog you write should include category headings such as "Features", "Improvements", "Highlights" and "Bug Fixes". This is important.
Under each category, summarize the most important changes in bullet points. This is important, don't halucinate this.
Make sure each section contains bullet points relevant to the category, ignore code improvements. Highlight the heading if there are mutiple bullet points make them a list with proper markdown bullets syntax. Your points should be related to whats important to a user not the developers. This is important. 
Write in markdown. Ignore numbers, IDs, and timestamps. Keep it light.
Limit prose.:\n\n${commits}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a changelog generator." },
      { role: "user", content: prompt },
    ],
  });
  return completion.choices[0].message.content;
}
