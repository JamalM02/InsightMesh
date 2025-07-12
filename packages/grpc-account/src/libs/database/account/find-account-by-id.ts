import { db } from '@libs/database/db';
import { InternalError, logger } from '@insightmesh/node-common';
import { Account } from '@prisma/client';

export const findAccountById = async (params: { id: string }): Promise<Account> => {
  try {
    const result = await db.account.findUniqueOrThrow({
      where: {
        id: params.id,
      },
    });
    return result;
  } catch (error) {
    logger.error('Failed to find account by ID:', error);
    throw new InternalError('FIND_ACCOUNT_ERROR');
  }
};
