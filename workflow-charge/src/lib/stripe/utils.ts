import { PaymentStatus } from '@insightmesh/grpc-account';
import Stripe from 'stripe';

export const mapStripeToGrpcStatus = (stripeStatus: Stripe.PaymentIntent.Status): PaymentStatus => {
  switch (stripeStatus) {
    case 'succeeded':
      return PaymentStatus.PAID;
    case 'processing':
    case 'requires_action':
    case 'requires_capture':
    case 'requires_confirmation':
    case 'requires_payment_method':
      return PaymentStatus.PENDING;
    case 'canceled':
      return PaymentStatus.FAILED;
    default:
      return PaymentStatus.PS_UNKNOWN;
  }
};
