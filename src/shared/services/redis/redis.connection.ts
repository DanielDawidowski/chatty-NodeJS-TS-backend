import Logger from 'bunyan';
import { config } from '@root/config';
import { BaseCache } from '@service/redis/base.cache';

const log: Logger = config.createLogger('redisConnection');

class RedisConnetion extends BaseCache {
  constructor() {
    super('redisConnection');
  }
  async connnect(): Promise<void> {
    try {
      await this.client.connect();
      const res = await this.client.ping();
      log.info(res, 'redis connected');
    } catch (error) {
      log.error(error);
    }
  }
}

export const redisConnection: RedisConnetion = new RedisConnetion();
