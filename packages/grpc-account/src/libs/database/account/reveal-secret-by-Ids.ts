import { db } from '@libs/database/db';
import { decrypt } from 'encrypt-tools';
import { env } from '@libs/env';
import { NotFoundError, InternalError, logger } from '@events-project/common';
import { RevealApiKeyParams } from '@libs/schemas';

export const revealSecretByIds = async (
  params: RevealApiKeyParams
): Promise<{ apiKey: string }> => {
  try {
    const { accountId, secretId } = params;

    const secretRecord = await db.secret.findFirst({
      where: {
        id: secretId,
        appId: accountId,
        isActive: true,
      },
    });

    if (!secretRecord) {
      throw new NotFoundError('SECRET_NOT_FOUND');
    }

    const [iv, ciphertext] = secretRecord.secret.split(':');

    if (!iv || !ciphertext) {
      logger.error('Malformed encrypted secret format:', secretRecord.secret);
      throw new InternalError('INVALID_SECRET_FORMAT');
    }

    const apiKey = decrypt({
      secretKey: env('SECRET_ENCRYPT_KEY'),
      iv,
      ciphertext,
    });

    return { apiKey };
  } catch (error) {
    logger.error('Failed to reveal API key:', error);
    throw new InternalError('REVEAL_API_KEY_ERROR');
  }
};
