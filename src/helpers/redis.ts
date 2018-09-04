const redis = require('node-redis');
// const BASE_URL = 'http://localhost:6379';

interface RedisClientInterface {
  get: (string) => string;
  set: (string, token) => void;
}

class RedisClient {
  private client: RedisClientInterface;
  private token: string;

  constructor() {
    this.client = redis.createClient();
    this.token = process.env["RUNDECK_MASTER_TOKEN"]
  }

  getToken() {
    const currentToken = this.client.get(this.token);
    return currentToken;
  }

  updateToken(token) {
    this.client.set(this.token, token);
  }
}

export default RedisClient;
