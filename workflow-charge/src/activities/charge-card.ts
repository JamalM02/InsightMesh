import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { toMinorUnits } from '@insightmesh/node-common';

export async function chargeCard({
  stripeId,
  usageCharge,
}: {
  stripeId: string;
  usageCharge: string;
}): Promise<Stripe.PaymentIntent> {
  const { CURRENCY } = process.env;
  if (!CURRENCY) {
    throw new Error('CURRENCY is not defined in environment variables');
  }

  const paymentMethods = await stripe.paymentMethods.list({
    customer: stripeId,
    type: 'card',
  });

  const paymentMethod = paymentMethods.data[0];
  if (!paymentMethod) {
    throw new Error('No payment method found for customer');
  }

  const minorUnit: number = toMinorUnits(usageCharge, CURRENCY);

  const paymentIntent = await stripe.paymentIntents.create({
    customer: stripeId,
    amount: minorUnit,
    currency: CURRENCY,
    payment_method: paymentMethod.id,
    confirm: true,
    off_session: true,
  });

  return paymentIntent;
}
