"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function completeOnboarding() {
  const { userId } = await auth();
  if (!userId) return { ok: false, reason: "NO_USER" };

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { onboardingComplete: true },
  });

  return { ok: true };
}
