import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
          IM
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          InsightMesh
        </h1>
      </div>
      <SignIn path="/auth/sign-in" routing="path" signUpUrl="/auth/sign-up" />
    </div>
  );
}
