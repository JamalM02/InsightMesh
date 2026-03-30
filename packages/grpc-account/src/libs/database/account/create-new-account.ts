import { db } from '@libs/database/db';
import { env } from '@libs/env';
import { generateTypeId, InternalError, logger } from '@insightmesh/node-common';
import { encrypt, hash, id } from 'encrypt-tools';
import { Account } from '@libs/prisma-client';
import { clickhouse } from '@libs/clickhouse';
import { stripe } from '@libs/stripe';

export const createNewAccount = async (params: {
  id: string;
  name: string;
  slug?: string;
}): Promise<Account> => {
  // Track stripeCustomerId outside the DB transaction so we can clean it up on failure
  let stripeCustomerId: string | undefined;

  try {
    const apiKey = id('sk', 42);
    const { iv, ciphertext } = encrypt({
      plaintext: apiKey,
      secretKey: env('SECRET_ENCRYPT_KEY'),
    });

    // Create the Stripe customer BEFORE the DB transaction so its ID is
    // available for proper cleanup if anything goes wrong afterwards.
    const stripeResult = await stripe.customers.create({
      name: params.id,
      description: `Customer for ${params.id}`,
      metadata: {
        appId: params.id,
      },
    });
    stripeCustomerId = stripeResult.id;

    const result = await db.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          id: params.id,
          stripeId: stripeCustomerId!,
          secret: {
            create: [
              {
                id: generateTypeId('secret'),
                type: 'SECRET_KEY',
                secret: `${iv}:${ciphertext}`,
                hash: hash(apiKey, 'sha256'),
                isActive: true,
              },
            ],
          },
        },
      });

      await clickhouse.createApp({
        appId: params.id,
        name: params.name,
        slug: params.slug,
      });

      return account;
    });

    return result;
  } catch (error) {
    // If the Stripe customer was created but the DB transaction failed,
    // clean it up using the correct Stripe customer ID (not params.id).
    if (stripeCustomerId) {
      await stripe.customers.del(stripeCustomerId).catch((cleanupErr) => {
        logger.error('Failed to clean up Stripe customer after account creation error:', cleanupErr);
      });
    }
    logger.error('Failed to create new account:', error);
    throw new InternalError('CREATE_ACCOUNT_ERROR');
  }
};
