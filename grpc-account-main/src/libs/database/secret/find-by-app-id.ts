import { db } from '@libs/database/db';
import { InternalError, logger } from '@events-project/common';
import { Secret } from '@prisma/client';

export const findSecretByAppId = async (params: { appId: string }): Promise<Secret> => {
  try {
    const result = await db.secret.findFirst({
      where: {
        appId: params.appId,
      },
    });
    if (!result) {
      throw new InternalError('SECRET_NOT_FOUND');
    }
    return result;
  } catch (error) {
    logger.error('Failed to find account by ID:', error);
    throw new InternalError('FIND_SECRET_ERROR');
  }
};
