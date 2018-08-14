const fetch = require('node-fetch');
const redisClient = require('./redis');

const BASE_URL = 'http://localhost:4440';


/**
 * NOTE: Authenticate with master token
 * 
 * @returns string
 */
const generateRundeckToken = () => {
  const date = new Date();

  const response = await fetch(
    BASE_URL + '/api/25/token', {
      headers: {
        "X-Rundeck-Auth-Token": process.env.MASTER_RUNDECK_TOKEN,
        "accept": "application/json",
        "Content-type": "application/json"
      },
      body: {
        "user": date.getTime(),
        "role": [
          "ROLE_user"
        ],
        "duration": "10080m"
      }
    }
  ).json();

  const tokenInfo = response.token;
  return tokenInfo;
};

const checkIsTokenExpired = async token => {
  const response = await fetch(
    BASE_URL + '/api/25/tokens',{
      headers: {
        "X-Rundeck-Auth-Token": token,
        "accept": "application/json"
      }
    }
  );

  const tokenInfo = response.json();
  return tokenInfo[0].expired;
};

const addJobToRundeck = async (...options) => {
  const redis = new redisClient();
  const rundeckAuthToken = redis.getToken();

  if(checkIsTokenExpired(rundeckAuthToken) || rundeckAuthToken === undefined){
    rundeckAuthToken = generateRundeckToken();
  }

  const form = new FormData();
  form.append('importFile', options.fileName);

  const response = await fetch(
    BASE_URL + '/api/25/project/test/jobs/import',
    {
      method: 'POST',
      headers: {
        "X-Rundeck-Auth-Token": rundeckAuthToken,
        "accept": "application/json"
      },
      body: form
    }
  );

  return response.json();
}

module.exports = {
  addJobToRundeck
}