const dockerPromise = require('../helpers/docker-promise');
const handle = require('../helpers/handle');
const express = require('express');
const router = express.Router();

router.post('/create/:name', async (req, res) => {
  const containerName = req.params.name;
  const dockerPull = async name => {
    if(name.match(/(.+):robaas/) === null) {
       return Promise.reject("This image is not adapted to RoBaaS"); 
    }
    const stream = await dockerPromise.pull(name)
                   .catch(error => (Promise.reject(error)));
    return stream;
  };

  const stream = await dockerPull(containerName)
                 .catch(message => handle.error(req, req, message));
  const createdContainer = await dockerPromise.run(containerName)
                           .catch(error => handle.error(req, res, error));
  const response = {
    status: true,
    code: req.statusCode,
    pulledOutout: stream,
    info: createdContainer
  };

  res.json(response);
});

router.get('/list', (req, res) => {
  const getContainers = async () => {
    const dockerContainers = await dockerPromise.ps()
                             .catch(error => (Promise.reject(error)));
    return dockerContainers;
  };
  
  getContainers().then(containers => {
    const response = {
      status: true,
      code: req.statusCode,
      containers: containers
    };

    res.json(response);
  }).catch(message => {
    handle.error(req, res, message);
  });                      
});

module.exports = router;