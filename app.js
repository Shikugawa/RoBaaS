const express = require('express');
const container = require('./src/routes/container');  
const healthcheck = require('./src/routes/healthcheck');
const rundeck = require('./src/routes/rundeck');

const app = express();

app.use('/container', container);
app.use('/job', rundeck);
app.use('/', healthcheck);

app.listen(3000);
