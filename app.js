const express = require('express');
const container = require('./src/routes/container');
const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env["FIREBASE_AUTH_DB"]
});

const app = express();

app.use('/container', container);
app.listen(3000);

export default admin;
