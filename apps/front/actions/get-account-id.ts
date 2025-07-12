"use server";

import {
  accountRpcClient,
  GetAccountRequest,
} from "@insightmesh/grpc-account";

export const getAccountId = async (params: GetAccountRequest) => {
  const result = await accountRpcClient.getAccount({ id: params.id });
  return result;
};
 