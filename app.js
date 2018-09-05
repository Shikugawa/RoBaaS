const express = require('express');
const container = require('./src/routes/container');
const auth = require('./src/routes/auth');

const app = express();

app.use('/auth', auth);
app.use('/container', container);
app.listen(3000);
