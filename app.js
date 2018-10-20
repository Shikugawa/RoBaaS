const express = require('express');
const container = require('./src/routes/container');  
const healthcheck = require('./src/routes/healthcheck');

const app = express();

app.use('/container', container);
app.use('/', healthcheck);

app.listen(3000);
