import { db } from '@libs/database/db';
import { logger, InternalError } from '@insightmesh/node-common';
import { PeriodCreditUsage } from '@prisma/client';
import { UpdateBillingParams } from '@libs/schemas/update-status'; // adjust the path if needed

export const updateBillingStatusById = async (
  params: UpdateBillingParams
): Promise<PeriodCreditUsage> => {
  try {
    const { id, paymentId, paymentStatus } = params;
    return await db.periodCreditUsage.update({
      where: { id },
      data: {
        paymentId,
        paymentStatus,
      },
    });
  } catch (error) {
    logger.error('Failed to update period billing record:', error);
    throw new InternalError('UPDATE_PERIOD_CREDIT_USAGE_ERROR');
  }
};
