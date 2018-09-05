import express = require('express');
const admin = require('firebase-admin');
const path = require('path');

const router = express.Router();

const serviceAccount = require(path.join(process.cwd(), process.env["FIREBASE_TOKEN_INFO"]));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env["FIREBASE_AUTH_DB"]
});

router.get('/gettoken/:uid', (req, res) => {
  const uid = req.params.uid;

  admin.auth().createCustomToken(uid)
  .then(customToken => res.json({
    token: customToken
  }));
});

module.exports = router;