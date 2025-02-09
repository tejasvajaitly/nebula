import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    const { commitMessages } = await req.json();

    if (!commitMessages) {
        return Response.json({ error: "No commit messages provided" }, { status: 400 });
    }

    const prompt = `Summarize the following commit messages into a structured Markdown changelog:\n\n${commitMessages}`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "system", content: "You are a changelog generator." }, { role: "user", content: prompt }],
        });

        return Response.json({ changelog: completion.choices[0].message.content });
    } catch (error) {
        return Response.json({ error: "OpenAI request failed" }, { status: 500 });
    }
}