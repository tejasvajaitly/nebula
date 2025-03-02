import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    return Response.json({ message: "Onboarding complete" }, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: "Error updating user metadata" },
      { status: 500 }
    );
  }
}
