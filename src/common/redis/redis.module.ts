import { Global, Module } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import Redlock from 'redlock';

export type RedisClient = RedisClientType;

const redisClientProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async (): Promise<RedisClientType> => {
    const client: RedisClientType = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    client.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error('Redis client error', err);
    });

    await client.connect();
    return client;
  },
};

const redlockProvider = {
  provide: 'REDLOCK',
  useFactory: (client: RedisClientType) =>
    new Redlock([client as any], {
      driftFactor: 0.01,
      retryCount: 10,
      retryDelay: 100,
      retryJitter: 100,
    }),
  inject: ['REDIS_CLIENT'],
};

@Global()
@Module({
  providers: [redisClientProvider, redlockProvider],
  exports: [redisClientProvider, redlockProvider],
})
export class RedisModule {}

