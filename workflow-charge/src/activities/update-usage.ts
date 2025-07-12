import { accountRpcClient, UpdateBillingResponse } from '@insightmesh/grpc-account';
import Stripe from 'stripe';
import { mapStripeToGrpcStatus } from '../lib/stripe';

export async function updatePeriodUsage({
  paymentId,
  summaryId,
  paymentStatus,
}: {
  paymentId: string;
  summaryId: string;
  paymentStatus: Stripe.PaymentIntent.Status;
}): Promise<UpdateBillingResponse> {
  return await accountRpcClient.updateBillingStatus({
    id: summaryId,
    paymentId,
    paymentStatus: mapStripeToGrpcStatus(paymentStatus),
  });
}
