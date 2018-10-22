import express = require('express');
import fs = require('fs');
import path = require('path');
import util = require('util');

const { addJobToRundeck } = require('../helpers/rundeck');
const handle = require('../helpers/handle');
const router = express.Router();

router.post('/add', async (req, res) => {
  if (req.body.imageUserName === undefined || req.body.imageName === undefined) {
    res.json({
      status: 400,
      message: "imageUserName or imageName must be passed"
    });
  }

  const jobDefinition = `
    <joblist>
      <job>
        <defaultTab>summary</defaultTab>
        <description>${req.body.description || 'description'}</description>
        <executionEnabled>true</executionEnabled>
        <loglevel>${req.body.loglevel || 'INFO'}</loglevel>
        <name>${req.body.name || 'name'}</name>
        <nodeFilterEditable>false</nodeFilterEditable>
        <scheduleEnabled>true</scheduleEnabled>
        <sequence keepgoing='false' strategy='node-first'>
          <command>
            <exec>docker run -t ${req.body.imageUserName}/${req.body.imageName}:robaas</exec>
          </command>
        </sequence>
      </job>
    </joblist>
  `;
  const tmpFilePath = path.join(__dirname, `../tmp/${req.body.imageUserName}_${req.body.imageName}.xml`);

  util.promisify(fs.writeFile)(tmpFilePath, jobDefinition)
  .catch(err => {
    res.send(err.message);
  });

  addJobToRundeck({
    fileName: tmpFilePath
  }).then(response => {
    res.json(response);
  }).catch(err => {
    res.send(err.message);
  }).finally(() => {
    fs.rmdirSync(tmpFilePath);
  })
});