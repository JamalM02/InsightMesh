import { InternalError, logger, NotFoundError } from '@events-project/common';
import { db } from '@libs/database/db';
import { PeriodBillingParams } from '@libs/schemas';
import { PeriodCreditUsage } from '@prisma/client';

const getLastPaidDate = async (appId: string): Promise<Date> => {
  try {
    const lastSummary = await db.periodCreditUsage.findFirst({
      where: { appId },
      orderBy: { end: 'desc' },
    });
    if (lastSummary) return lastSummary.end;

    const firstUsage = await db.creditUsage.findFirstOrThrow({
      where: { appId },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    });
    return firstUsage.createdAt;
  } catch (error) {
    throw new NotFoundError('APP_USAGE_NOT_FOUND');
  }
};

export const summarizePeriodUsage = async ({
  appId,
  target,
}: PeriodBillingParams): Promise<PeriodCreditUsage> => {
  try {
    const start = await getLastPaidDate(appId);
    const total = await db.creditUsage.aggregate({
      where: {
        appId,
        createdAt: {
          gte: start,
          lt: target,
        },
      },
      _sum: {
        credits: true,
      },
    });

    return await db.periodCreditUsage.create({
      data: {
        appId,
        start,
        end: target,
        credits: total._sum.credits ?? BigInt(0),
      },
    });
  } catch (error) {
    console.log(error);
    logger.error('Failed to summarize period usage:', error);
    throw new InternalError('SUMMARIZE_PERIOD_USAGE_ERROR');
  }
};
