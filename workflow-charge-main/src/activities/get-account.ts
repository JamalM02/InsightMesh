import { Account, accountRpcClient } from '@events-project/grpc-account';

export const getAccount = async ({ id }: { id: string }): Promise<Account> => {
  const response = await accountRpcClient.getAccount({ id });
  return response;
};
