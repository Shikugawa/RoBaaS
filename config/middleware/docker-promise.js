const Docker = require('dockerode');

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

module.exports = {
  pull: dockerPullPromise
}