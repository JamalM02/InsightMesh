import { GetSecretRequest, GetSecretResponse } from '@grpc/service';
import { findSecretByAppId } from '@libs/database/secret';

import { SecretSchema } from '@libs/schemas';

export const getSecret = async (request: GetSecretRequest): Promise<GetSecretResponse> => {
  const params = SecretSchema.parse(request);
  const result = await findSecretByAppId(params);
  return {
    appId: result.appId,
    secretId: result.id,
  };
};
