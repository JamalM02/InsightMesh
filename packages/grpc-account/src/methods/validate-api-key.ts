import { NotFoundError } from '@events-project/common';
import { ValidateApiKeyRequest, Account } from '@grpc/service';
import { findAccountByKey } from '@libs/database/account';

export const validateApiKey = async (request: ValidateApiKeyRequest): Promise<Account> => {
  const result = await findAccountByKey(request.key);
  if (!result) throw new NotFoundError('ACCOUNT_NOT_FOUND');
  return {
    id: result.id,
    stripeId: result.stripeId,
  };
};
