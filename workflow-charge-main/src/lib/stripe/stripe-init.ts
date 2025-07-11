import Stripe from 'stripe';

const { STRIPE_SECRET_KEY} = process.env;
if (!STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY);