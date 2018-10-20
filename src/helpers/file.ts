import path = require('path');
import fs = require('fs');

const mkdirRecursive: (name: Array<string>, currentPath: string) => void = (name: Array<string>, currentPath: string) => {
  if (name.length === 0) {
    return;
  }

  const dir = name.shift();
  fs.mkdirSync(path.join(currentPath, `${dir}`));
  currentPath += `/${dir}`;
  mkdirRecursive(name, currentPath);

  return;
};

export const getFileStream: (name: string) => fs.WriteStream = (name: string) => {
  const logFileName: RegExpMatchArray = name.match(/(.+):robaas/);
  
  if(logFileName === null) {
    throw new Error('invalid name');
  }
  
  const filePath: string = path.join(__dirname, `../log/${logFileName[1]}.log`);
  if(!fs.existsSync(filePath)){
    const logPath: Array<string> = logFileName[1].split('/');
    
    logPath.unshift('log');
    logPath.pop();
    
    mkdirRecursive(logPath, path.join(__dirname, '../'));

    try {
      fs.writeFileSync(filePath, "");  
    } catch (error) {
      throw new Error(error.message);
    }
    
  };

  return fs.createWriteStream(filePath, { flags: 'a' });
};
