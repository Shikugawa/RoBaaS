const express = require('express');
const swaggerDoc = require('swagger-jsdoc');
const container = require('./config/routing/container');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'RoBaaS'
    }
  },
  apis: ['./index.js']
};

const app = express();
const swaggerSpec = swaggerDoc(swaggerOptions);

app.use('/container', container);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports = app.listen(3000);
