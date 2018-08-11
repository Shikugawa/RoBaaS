const fetch = require('node-fetch');
const redisClient = require('./redis');

const BASE_URL = 'http://localhost:4440';


/**
 * TODO: Authenticate with master token
 * 
 * @returns token
 */
const generateRundeckToken = () => {
  // const response = await fetch(
  //   BASE_URL + '/api/25/token/admin', {
  //     headers: {
  //       "X-Rundeck-Auth-Token": process.env.MASTER_RUNDECK_TOKEN,
  //       "accept": "application/json"
  //     }
  //   }
  // );

  // const tokenInfo = response.json();
  // return tokenInfo
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
  addJobToRundeck,
  generateRundeckToken
}