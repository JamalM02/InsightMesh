import { z } from 'zod';
import { saveCreditUsage } from '@libs/database/account/save-credit-usage';
import { UsageType } from '@prisma/client';

const EventSchema = z.object({
  id: z.string().min(1),
  appId: z.string().min(1),
  type: z.string().min(1),
});

export const handleEvent = async (event: unknown): Promise<void> => {
  const params = EventSchema.parse(event);
  const creditValue = Math.floor(Math.random() * 100);
  await saveCreditUsage({
    id: params.id,
    appId: params.appId,
    type: UsageType.EVENT,
    credits: BigInt(creditValue),
  });
};
