"use server";

import {
    accountRpcClient,
    GetSecretRequest,
} from "@events-project/grpc-account";

export const getSecret = async (params: GetSecretRequest) => {
    return await accountRpcClient.getSecret({ appId: params.appId });
};
