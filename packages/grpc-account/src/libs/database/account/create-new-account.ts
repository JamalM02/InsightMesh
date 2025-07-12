import { db } from '@libs/database/db';
import { env } from '@libs/env';
import { generateTypeId, InternalError, logger } from '@insightmesh/node-common';
import { encrypt, hash, id } from 'encrypt-tools';
import { Account } from '@prisma/client';
import { clickhouse } from '@libs/clickhouse';
import { stripe } from '@libs/stripe';

export const createNewAccount = async (params: {
  id: string;
  name: string;
  slug?: string;
}): Promise<Account> => {
  try {
    const apiKey = id('sk', 42);
    const { iv, ciphertext } = encrypt({
      plaintext: apiKey,
      secretKey: env('SECRET_ENCRYPT_KEY'),
    });

    const result = await db.$transaction(async (tx) => {
      const stripeResult = await stripe.customers.create({
        name: params.id,
        description: `Customer for ${params.id}`,
        metadata: {
          appId: params.id,
        },
      });

      const account = await tx.account.create({
        data: {
          id: params.id,
          stripeId: stripeResult.id,
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
    await stripe.customers.del(params.id);
    logger.error('Failed to create new account:', error);
    throw new InternalError('CREATE_ACCOUNT_ERROR');
  }
};
