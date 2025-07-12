"use server";

import {
    accountRpcClient,
    GetSecretRequest,
} from "@insightmesh/grpc-account";

export const getSecret = async (params: GetSecretRequest) => {
    return await accountRpcClient.getSecret({ appId: params.appId });
};
