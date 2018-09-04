import redis = require('node-redis');
// const BASE_URL = 'http://localhost:6379';


class RedisClient {
  private client: redis.RedisClient;
  private token: string;

  constructor() {
    this.client = redis.createClient();
    this.token = process.env["RUNDECK_MASTER_TOKEN"]
  }

  getToken(): string {
    const currentToken = this.client.get(this.token);
    return currentToken;
  }

  updateToken(token: string): void {
    this.client.set(this.token, token);
  }
}

export default RedisClient;
