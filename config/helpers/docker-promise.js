const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');

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

const createContainer = async name => {
  const logFileName = name.match(/(.+):robaas/)
  if(logFileName === null) return Promise.reject("This image can't adapted to RoBaaS");
  
  const filePath = path.join(__dirname, `../log/${logFileName[1]}.log`);
  if(!fs.existsSync(filePath)){
    const logPath = logFileName[1].split('/');
    fs.mkdir(path.join(__dirname, `../log/${logPath[0]}`), 
             err => { return Promise.reject(err) });
    fs.writeFile(filePath, "", err => { return Promise.reject(err) });
  }

  const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
  const container = await docker.run(name, [], fileStream)
                    .catch(err => { return Promise.reject(err) });
  return container
};

module.exports = {
  pull: dockerPullPromise,
  run: createContainer,
  ps: getRunningContainers
}