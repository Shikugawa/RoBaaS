const { getFileStream } = require('../helpers/file')
const { responseMessage } = require('../helpers/response')
const handle = require('../helpers/handle');
const express = require('express');
const Docker = require('dockerode');

const router = express.Router();
const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

router.post('/create/:name', async (req, res) => {
  const containerName = req.params.name;
  const msg = Object.assign({}, responseMessage.succeess);

  const dockerPull = async name => {
    if(name.match(/(.+):robaas/) === null) {
       return Promise.reject("This image is not adapted to RoBaaS"); 
    }
    
    const stream = await docker.pull(name)
                   .catch(err => (Promise.reject(err)));
    return stream;
  };

  const dockerRun = async name => {
    const fileStream = getFileStream();

    if (fileStream instanceof fs.WriteStream) {
      const container = await docker.run(name, [], fileStream)
                      .catch(err => (Promise.reject(err)));
      return new Container(container);
    }else{
      return Promise.reject("Can't get output stream");
    } 
  }

  dockerPull(containerName)
  .then(stream => {
    dockerRun(containerName)
    .then(container => {
      handle.createAPIResponse(res, msg, 200, stream, container);
    }).catch(error => handle.createAPIResponse(res, msg, 500, stream, error))
  }).catch(error => handle.createAPIResponse(res, msg, 500, error));
});

router.get('/list', async (req, res) => {
  const getContainers = async () => {
    const containers = await docker.listContainers()
                       .catch(err => (Promise.reject(err)));
    return containers;
  };
  
  getContainers()
  .then(containers => {
    handle.listAPIResponse(res, 200, containers)
  }).catch(error => handle.listAPIResponse(res, 400, error));
});

router.post('/destroy/:id', async (req, res) => {

});

module.exports = router;