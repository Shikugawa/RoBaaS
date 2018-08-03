const swagger = require('swagger-express');
const fs = require('fs');
const path = require('path');

const getFiles = () => {
  const list = fs.readdirSync(
    path.join(__dirname, '../config/routing')
  );

  return list.map(file => path.join(__dirname, '../config/routing/' + file));
};

const swaggerInit = args => {
  const apis = getFiles();

  console.log(apis);
  
  swagger.init(args.app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    swaggerURL: '/docs',
    swaggerJSON: '/api-docs',   
    swaggerUI: path.join(__dirname, '../swagger'),        
    basePath: 'http://localhost:3000',
    apis: apis,
    middleware: (req, res) => {}
  })
}

module.exports = swaggerInit;