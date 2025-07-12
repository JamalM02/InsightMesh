"use server";

import {
    accountRpcClient,
    RevealApiKeyRequest,
} from "@insightmesh/grpc-account";

export const revealApiKey = async (params: RevealApiKeyRequest) => {
    const result = await accountRpcClient.revealApiKey({
        accountId: params.accountId,
        secretId: params.secretId,
    });

    return result.apiKey;
};
