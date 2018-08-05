const dockerPromise = require('../helpers/docker-promise');
const handle = require('../helpers/handle');
const express = require('express');
const router = express.Router();

router.post('/create/:name', (req, res) => {
  const containerName = req.params.name;
  const dockerPull = async name => {
    if(name.match(/(.+):robaas/) === null) {
       return Promise.reject("This image is not adapted to RoBaaS"); 
    }
    const stream = await dockerPromise.pull(name)
                   .catch(error => {
                     return Promise.reject(error);
                   });
    return stream;
  };

  dockerPull(containerName).then(stream => {
    const createdContainer = await dockerPromise.run(containerName)
                             .catch(error => handle.error(req, res, error));
    const response = {
      status: true,
      code: req.statusCode,
      info: JSON.stringify(createdContainer)
    }

    res.json(JSON.stringify(stream));
  }).catch(message => {
    handle.error(req, res, message);
  });
});

router.get('/list', (req, res) => {
  const getContainers = async () => {
    const dockerContainers = await dockerPromise.ps()
                             .catch(error => { return Promise.reject(error); });
    return dockerContainers;
  };
  
  getContainers().then(containers => {
    const response = {
      status: true,
      code: req.statusCode,
      containers: containers
    }

    res.json(response);
  }).catch(message => {
    handle.error(req, res, message);
  });                      
});

module.exports = router;