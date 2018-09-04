const path = require('path');
const fs = require('fs');

export const getFileStream = (name: string) => {
  const logFileName = name.match(/(.+):robaas/)
  if(logFileName === null) return Promise.reject("This image can't adapted to RoBaaS");
  
  const filePath = path.join(__dirname, `../log/${logFileName[1]}.log`);
  if(!fs.existsSync(filePath)){
    const logPath = logFileName[1].split('/');
    fs.mkdir(path.join(__dirname, `../log/${logPath[0]}`), 
            err => (Promise.reject(err)));
    fs.writeFile(filePath, "", err => (Promise.reject(err)));
  };

  return fs.createWriteStream(filePath, { flags: 'a' });
};
