import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities';

const { chargeCard, summarize, updatePeriodUsage, getAccount } = proxyActivities<typeof activities>(
  {
    startToCloseTimeout: '1 minute',
  }
);

export async function chargeAccountWorkflow(params: { appId: string }) {
  const account = await getAccount({ id: params.appId });
  const summary = await summarize({ appId: params.appId });

  const paymentIntent = await chargeCard({
    stripeId: account.stripeId,
    usageCharge: summary.credits,
  });

  const updateUsageResult = await updatePeriodUsage({
    summaryId: summary.id,
    paymentId: paymentIntent.id,
    paymentStatus: paymentIntent.status,
  });

  return {
    account,
    summary,
    paymentIntent,
    updateUsageResult,
  };
}
