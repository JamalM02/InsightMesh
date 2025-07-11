import { CreateAccountRequest, Account } from '@grpc/service';
import { createNewAccount } from '@libs/database/account';
import { CreateAccountSchema } from '@libs/schemas';

export const createAccount = async (request: CreateAccountRequest): Promise<Account> => {
  const params = CreateAccountSchema.parse(request);
  const result = await createNewAccount({
    id: params.id,
    name: params.name,
    slug: params.slug,
  });

  return result;
};
