import express = require('express');
import Docker = require('dockerode');

interface Image {
  RepoTags: Array<string>;
}

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

router.post('/create/:username/:imagename', async (req, res) => {
  const username: string = req.params.username;
  const containerName: string = req.params.imagename;
  const passingName: string = `${username}/${containerName}:robaas`;

  const dockerPull: (name: string) => Promise<string | Object> = async name => {
    if(name.match(/(.+):robaas/) === null) {
       return Promise.reject("This image is not adapted to RoBaaS"); 
    }
    
    if(auth.username === undefined || auth.password === undefined || auth.email === undefined){
      auth = null
    }

    const stream = await docker.pull(name, {}, auth)
                   .catch(err => Promise.reject(err));
    return stream
  };

  const dockerRun: (name: string) => Promise<string | Object> = async name => {
    let fileStream;

    try {
      fileStream = getFileStream(name);  
    } catch (error) {
      return Promise.reject(error.message);
    }

    const result = await docker.run(name, [], fileStream)
                  .catch(err => Promise.reject(err));
    return result;               
  }
        
  dockerPull(passingName)
  .then(stream => {
    dockerRun(passingName)
    .then(container => {
      after('success', res, stream, JSON.stringify(container));
    })
    .catch(error => {
      after('failed', res, stream, JSON.stringify(error));
    })
  })
  .catch(error => {
    after('failed', res, error);
  });
});

router.get('/list', async (req, res) => {
  const token = req.headers.authorization;

  const getDockerImages: () => Promise<Array<Object>> = async () => {
    const containers = await docker.listImages()
                       .catch(err => Promise.reject(err));
    return containers;
  };

  getDockerImages()
  .then(containers => {
    const robaasImages = containers.filter((container: Image) => {
      const containerRepoTags = container.RepoTags;
      return containerRepoTags.length === 1 && containerRepoTags[0].match(/(.*):robaas/);
    });
    
    handle.listAPIResponse(res, {}, 200, robaasImages);
  })
  .catch(error => handle.listAPIResponse(res, 400, error));
});

router.post('/destroy/:id', async (req, res) => {
  const token = req.headers.authorization;
  const imageId = req.params.id;
  const image = docker.getImage(imageId);

  image.remove()
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
