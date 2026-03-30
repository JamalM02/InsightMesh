import { getAccountId } from "@/actions/get-account-id";
import { getClientSecret } from "@/providers/stripe/actions/get-secret";
import StripeProvider from "@/providers/stripe/stripe-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { auth } from "@clerk/nextjs/server";
import { AlertCircle } from "lucide-react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      return (
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No organization selected</AlertTitle>
            <AlertDescription>
              Please select an organization to manage payment methods.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    const accountData = await getAccountId({ id: orgId });

    if (!accountData?.stripeId) {
      return (
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Account not configured</AlertTitle>
            <AlertDescription>
              Your account does not have a billing profile set up yet. Please
              complete onboarding first.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    const secret = await getClientSecret(accountData.stripeId);

    return <StripeProvider clientSecret={secret}>{children}</StripeProvider>;
  } catch (error) {
    console.error("[Payments Layout] Failed to initialize payment services:", error);
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment service unavailable</AlertTitle>
          <AlertDescription>
            Unable to initialize payment services. Please try again later or
            contact support if the issue persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
