const redisClient = require('./redis');
const _fetch = require('node-fetch');

const BASE_URL = 'http://localhost:4440';

const generateRundeckToken: () => Promise<string> = async () => {
  const date = new Date();

  const response = await _fetch(
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

const checkIsTokenExpired: (name: string) => Promise<boolean> = async (token: string) => {
  const response = await _fetch(
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

const addJobToRundeck: (options: { fileName: string }) => Promise<Object> = async (options: { fileName: string }) => {
  const redis = new redisClient();
  let rundeckAuthToken: string = redis.getToken();

  if(await checkIsTokenExpired(rundeckAuthToken) || rundeckAuthToken === undefined){
    rundeckAuthToken = await generateRundeckToken();
  }

  const form = new FormData();
  form.append('importFile', options.fileName);

  const response = await _fetch(
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