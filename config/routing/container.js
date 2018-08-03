const dockerPromise = require('../middleware/docker-promise');
const express = require('express');
const router = express.Router();

router.post('/create/:name', (req, res) => {
  const containerName = req.params.name;
  const dockerPull = async name => {
    if(name.match(/(.+):robaas/) === null) {
       Promise.reject("This image is not adapted to RoBaaS"); 
    }
    const stream = await dockerPromise.pull(name)
                   .catch(error => Promise.reject(error));
    return stream;
  };

  dockerPull(containerName).then(stream => {
    const response = {
      status: true,
      code: req.statusCode,
      info: JSON.stringify(stream)
    }
    res.json(JSON.stringify(stream));
  }).catch(message => {
    res.json(JSON.stringify({
      status: false,
      code: req.statusCode,
      message: message
    }));
  })
});

module.exports = router;
