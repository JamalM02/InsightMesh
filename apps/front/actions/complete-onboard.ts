"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const completeOnboarding = async () => {
  try {
    const { userId } = await auth();
    const client = await clerkClient();
    if (!userId) return redirect("/");
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
  } catch (err) {
    console.error(err);
    return redirect("/");
  }
};
