import { PaymentStatus as GrpcPaymentStatus } from '@grpc/service';
import { PaymentStatus } from '@prisma/client';
import { z } from 'zod';
// import { PaymentStatus } from '@prisma/client';

export const UpdateBillingSchema = z.object({
  id: z.string().uuid(),
  paymentId: z.string().min(1),
  paymentStatus: z.nativeEnum(GrpcPaymentStatus).transform((value): PaymentStatus => {
    switch (value) {
      case GrpcPaymentStatus.PENDING:
        return 'PENDING';
      case GrpcPaymentStatus.PAID:
        return 'PAID';
      case GrpcPaymentStatus.FAILED:
        return 'FAILED';
      default:
        throw new Error('Invalid payment status');
    }
  }),
});

export type UpdateBillingParams = z.infer<typeof UpdateBillingSchema>;
