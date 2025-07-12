import { createClient } from '@clickhouse/client';
import { InternalError, logger } from '@insightmesh/node-common';
import { env } from '@libs/env';

const client = createClient({
  url: env('CLICKHOUSE_URL'),
  username: env('CLICKHOUSE_USERNAME'),
  password: env('CLICKHOUSE_PASSWORD'),
});

const createApp = async (params: { appId: string; name: string; slug?: string }): Promise<void> => {
  try {
    await client.insert({
      table: 'applications',
      values: [
        {
          appId: params.appId,
          name: params.name,
          slug: params.slug,
        },
      ],
      format: 'JSONEachRow',
    });
  } catch (error) {
    logger.error(error);
    throw new InternalError();
  }
};

export const clickhouse = {
  createApp,
};
