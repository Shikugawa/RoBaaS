const fetch = require('node-fetch');
const BASE_URL = 'http://localhost:4440';

const generateRundeckToken = () => {
  const response = await fetch(
    BASE_URL + '/api/25/token/admin', {
      headers: {
        "X-Rundeck-Auth-Token": token,
        "accept": "application/json"
      }
    }
  );

  const tokenInfo = response.json();
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
  const rundeckAuthToken = gettoken() // TODO: get token from redis
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
        "X-Rundeck-Auth-Token": rundeckAuthToken
      },
      body: form
    }
  );

  return response.json();
}