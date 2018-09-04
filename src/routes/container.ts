import fs = require('fs');
import express = require('express');
import Docker = require('dockerode');
import util = require('util');

const { getFileStream } = require('../helpers/file')
const { responseMessage } = require('../helpers/response');
const handle = require('../helpers/handle') ;

const router = express.Router();
const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

let auth = {
  username: process.env['HUB_USERNAME'],
  password: process.env['HUB_PASSWORD'],
  auth: '',
  email: process.env['HUB_EMAIL'],
  serveraddress: 'https://index.docker.io/v1'
};

router.post('/create/:name', async (req, res) => {
  const containerName: string = req.params.name;

  const dockerPull: (name: string) => Promise<Object> = async name => {
    if(name.match(/(.+):robaas/) === null) {
       return Promise.reject("This image is not adapted to RoBaaS"); 
    }
    
    if(auth.username === undefined || auth.password === undefined || auth.email === undefined){
      auth = null
    }

    const stream = await docker.pull(name, {}, auth)
                   .catch(err => (Promise.reject(err)));
    return stream
  };

  const dockerRun: (name: string) => Promise<string | Object> = async name => {
    const fileStream = getFileStream();

    if (fileStream instanceof fs.WriteStream) {
      const result = await docker.run(name, [], fileStream)
                     .catch(err => (Promise.reject(err)));
      return result;               
    }else{
      return Promise.reject("Can't get output stream");
    } 
  }

  const after = (status, res, ...options) => {
    switch (status) {
      case 'success':
        const msg = Object.assign({}, responseMessage.succeess);
        handle.createAPIResponse(res, msg, 200, options[0], options[1]);
        break;
      case 'failed':
        const _msg = Object.assign({}, responseMessage.failed);
        handle.createAPIResponse(res, _msg, 500, options[0]);
        break;
      default:
        break;
    }
  }

  dockerPull(containerName)
  .then(stream => {
    dockerRun(containerName)
    .then(container => {
      after('success', res, stream, container);
    })
    .catch(error => {
      after('failed', res, stream, error);
    })
  })
  .catch(error => {
    after('failed', res, error);
  });
});

router.get('/list', async (req, res) => {
  const getContainers: () => Promise<Array<Object>> = async () => {
    const containers = await docker.listContainers()
                       .catch(err => (Promise.reject(err)));
    return containers;
  };
  
  getContainers()
  .then(containers => {
    handle.listAPIResponse(res, 200, containers)
  })
  .catch(error => handle.listAPIResponse(res, 400, error));
});

router.post('/destroy/:id', async (req, res) => {
  const containerId = req.params.id;
  const container = docker.getContainer(containerId);
  const containerRemoveAsync = util.promisify(container.remove);
  
  containerRemoveAsync()
  .then(data => {
    const msg = Object.assign({}, responseMessage.succeess);
    handle.removeAPIResponse(res, msg, 200, data);
  })
  .catch(error => {
    const msg = Object.assign({}, responseMessage.failed);
    handle.removeAPIResponse(res, msg, 500, error);
  })
});

module.exports = router;
