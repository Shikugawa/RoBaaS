const Docker = require('dockerode');
const fs = require('fs');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

const dockerPullPromise = name => {
  docker.pull(name, (stream, error) => {
    return new Promise((resolve, reject) => {
      if(error) reject(error);
      resolve(stream);
    });
  });
};

const getRunningContainers = () => {
  docker.listContainers((err, containers) => {
    return new Promise((resolve, reject) => {
      if(err) reject(err);
      resolve(containers);
    });
  });
};

const createContainer = (name, cmd) => {
  const fileStream = fs.createWriteStream(`../log/${name}.log`);
  docker.run(name, cmd, fileStream).then(container => {
    return Promise.resolve(container);
  }).catch(err => { return Promise.reject(err) });
};

module.exports = {
  pull: dockerPullPromise,
  run: createContainer,
  ps: getRunningContainers
}