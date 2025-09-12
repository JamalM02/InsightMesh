import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();
  if (sessionClaims?.onboardingComplete === true) {
    redirect("/dashboard");
  }
  return <>{children}</>;
}
