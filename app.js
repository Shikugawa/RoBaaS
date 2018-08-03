const express = require('express');
const container = require('./config/routing/container');
const swaggerInit = require('./config/swagger');

const app = express();

swaggerInit({app});
app.use('/container', container);

app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path)
  }
})

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports = app.listen(3000);
