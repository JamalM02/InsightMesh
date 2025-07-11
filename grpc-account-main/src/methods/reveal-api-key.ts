import { RevealApiKeyRequest, RevealApiKeyResponse } from '@grpc/service';
import { revealSecretByIds } from '@libs/database/account';
import { RevealApiKeySchema } from '@libs/schemas';

export const revealApiKey = async (request: RevealApiKeyRequest): Promise<RevealApiKeyResponse> => {
  const params = RevealApiKeySchema.parse(request);
  const { apiKey } = await revealSecretByIds(params);
  return { apiKey };
};
