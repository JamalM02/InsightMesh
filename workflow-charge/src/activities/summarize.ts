import { endOfToday } from 'date-fns';
import { accountRpcClient, SummarizePeriodUsageResponse } from '@insightmesh/grpc-account';

export async function summarize({
  appId,
}: {
  appId: string;
}): Promise<SummarizePeriodUsageResponse> {
  const date = endOfToday();
  const result = await accountRpcClient.monthlyBilling({
    appId,
    target: date.toISOString(),
  });

  return result;
}
