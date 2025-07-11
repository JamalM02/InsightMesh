import { Stripe } from "@/lib/stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
