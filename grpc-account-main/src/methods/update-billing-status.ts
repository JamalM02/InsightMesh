import { UpdateBillingRequest, UpdateBillingResponse } from '@grpc/service';
import { updateBillingStatusById } from '@libs/database/account/update-billing-status-by-Id';
import { UpdateBillingSchema } from '@libs/schemas';

export const updateBillingStatus = async (
  request: UpdateBillingRequest
): Promise<UpdateBillingResponse> => {
  const params = UpdateBillingSchema.parse(request);
  const record = await updateBillingStatusById(params);
  return {
    id: record.id,
    appId: record.appId,
    start: record.start.toISOString(),
    end: record.end.toISOString(),
    credits: record.credits.toString(),
    paymentId: record.paymentId ?? '',
    paymentStatus: record.paymentStatus,
    updatedAt: record.updatedAt.toISOString(),
  };
};
