const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

/**
 *
 *
 * @returns {Promise<string> | fs.WriteStream}
 */
const getFileStream = () => {
  const logFileName = name.match(/(.+):robaas/)
  if(logFileName === null) return Promise.reject("This image can't adapted to RoBaaS");
  
  const filePath = path.join(__dirname, `../log/${logFileName[1]}.log`);
  if(!fs.existsSync(filePath)){
    const logPath = logFileName[1].split('/');
    fs.mkdir(path.join(__dirname, `../log/${logPath[0]}`), 
            err => { return Promise.reject(err) });
    fs.writeFile(filePath, "", err => { return Promise.reject(err) });
  };

  return fs.createWriteStream(filePath, { flags: 'a' });
};

export class Container {
  /**
   *
   *
   * @static
   * @param {string} name 
   * @returns {Promise<Container>}
   * @memberof Container
   */
  static async create(name) {
    const fileStream = getFileStream();
    if (fileStream instanceof fs.WriteStream) {
      const container = await docker.run(name, [], fileStream)
                      .catch(err => (Promise.reject(err)));
    
      return new Container(container);
    } 
  }

  /**
   *
   *
   * @static
   * @param {string} name
   * @return {Promise<string>}
   * @memberof Container
   */
  static async pull(name) {
    const stream = await docker.pull(name)
                   .catch(err => (Promise.reject(err)));
    return stream;
  }

  /**
   *
   *
   * @static
   * @returns {Promise<Object>}
   * @memberof Container
   */
  static async running () {
    const containers = await docker.listContainers()
                       .catch(err => (Promise.reject(err)));
    return containers;
  }

  /**
   *Creates an instance of Container.
   * @param {Promise<Object>} container
   * @memberof Container
   */
  constructor(container) {
    this.container = docker.getContainer(container.id)
  }

  /**
   *
   *
   * @returns {Promise<Object>}
   * @memberof Container
   */
  remove () {
    return this.container.remove()
  }
}
