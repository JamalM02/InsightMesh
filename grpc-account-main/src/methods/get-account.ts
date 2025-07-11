import { findAccountById } from '@libs/database/account';
import { Account, GetAccountRequest } from '@grpc/service';

export const getAccount = async (request: GetAccountRequest): Promise<Account> => {
  const record = await findAccountById(request);
  return {
    id: record.id,
    stripeId: record.stripeId,
  };
};
