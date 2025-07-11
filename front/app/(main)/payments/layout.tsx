import { getAccountId } from "@/actions/get-account-id";
import { getClientSecret } from "@/providers/stripe/actions/get-secret";
import StripeProvider from "@/providers/stripe/stripe-provider";
import { auth } from "@clerk/nextjs/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { orgId } = await auth();
  const accountData = await getAccountId({ id: orgId || "" });
  const secret = await getClientSecret(accountData.stripeId);

  return <StripeProvider clientSecret={secret}>{children}</StripeProvider>;
}
