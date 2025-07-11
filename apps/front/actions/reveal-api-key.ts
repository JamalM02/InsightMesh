"use server";

import {
    accountRpcClient,
    RevealApiKeyRequest,
} from "@events-project/grpc-account";

export const revealApiKey = async (params: RevealApiKeyRequest) => {
    const result = await accountRpcClient.revealApiKey({
        accountId: params.accountId,
        secretId: params.secretId,
    });

    return result.apiKey;
};
