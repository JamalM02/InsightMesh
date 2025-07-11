import { SummarizePeriodUsageRequest, SummarizePeriodUsageResponse } from '@grpc/service';
import { summarizePeriodUsage } from '@libs/database/account';
import { PeriodBillingSchema } from '@libs/schemas';

export const monthlyBilling = async (
  request: SummarizePeriodUsageRequest
): Promise<SummarizePeriodUsageResponse> => {
  const { appId, target } = PeriodBillingSchema.parse(request);
  const record = await summarizePeriodUsage({
    appId,
    target,
  });

  return {
    id: record.id,
    appId: record.appId,
    start: record.start.toISOString(),
    end: record.end.toISOString(),
    credits: record.credits.toString(),
  };
};
