const redis = require('redis');
// const BASE_URL = 'http://localhost:6379';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.token = "RundeckAPIToken"
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
