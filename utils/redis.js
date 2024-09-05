import Redis from 'ioredis';

class RedisClient {
  constructor() {
    this.client = new Redis();
  }

  async ping() {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('Redis ping failed:', error);
      return false;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
