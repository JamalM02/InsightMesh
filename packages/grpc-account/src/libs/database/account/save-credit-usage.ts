import { logger, InternalError } from '@events-project/common';
import { db } from '@libs/database/db';
import { CreditUsage, UsageType } from '@prisma/client';

export const saveCreditUsage = async ({
  id,
  appId,
  type,
  credits,
}: {
  id: string;
  appId: string;
  type: UsageType;
  credits: bigint;
}): Promise<CreditUsage> => {
  try {
    return await db.creditUsage.create({
      data: {
        id,
        appId,
        type,
        credits,
      },
    });
  } catch (error) {
    logger.error('Failed to save credit usage:', error);
    throw new InternalError('SAVE_CREDIT_USAGE_ERROR');
  }
};
