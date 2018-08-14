const express = require('express');
const container = require('./src/routes/container');

const app = express();

app.use('/container', container);

module.exports = app.listen(3000);
