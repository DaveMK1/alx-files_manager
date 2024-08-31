import { promisify } from 'util';
import { createClient } from 'redis';

// Redis client class
class RedisClient {
  // Initializes new instance
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  // Check connection status of redis client
  isAlive() {
    return this.isClientConnected;
  }

  // Search for value associated with given key
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  // Adds a value with given key to redis
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  // deletes key value pair from redis server
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
