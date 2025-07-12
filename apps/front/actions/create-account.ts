"use server";

import {
  accountRpcClient,
  CreateAccountRequest,

} from "@insightmesh/grpc-account";
export const createAccount = async (params: CreateAccountRequest) => {
  const result = await accountRpcClient.createAccount(params);
  return result;
};
