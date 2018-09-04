import path = require('path');
import fs = require('fs');

export const getFileStream: (name: string) => fs.WriteStream | Promise<never> = (name: string) => {
  const logFileName: RegExpMatchArray = name.match(/(.+):robaas/)
  if(logFileName === null) return Promise.reject("This image can't adapted to RoBaaS");
  
  const filePath: string = path.join(__dirname, `../log/${logFileName[1]}.log`);
  if(!fs.existsSync(filePath)){
    const logPath: Array<string> = logFileName[1].split('/');
    fs.mkdir(path.join(__dirname, `../log/${logPath[0]}`), 
            err => (Promise.reject(err)));
    fs.writeFile(filePath, "", err => (Promise.reject(err)));
  };

  return fs.createWriteStream(filePath, { flags: 'a' });
};
