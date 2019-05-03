const express = require('express');
const messageWebhook = require('../src/message-webhook');
const path = require('path')
const childProcess = require('child_process');
require("../config/database")("mongodb://admin:z8gr922g@ds021172.mlab.com:21172/aparecida-chatbot")

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/aparecidabot", express.static("src/public"))

app.get('/aparecidabot', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/public/views/index.html'));
})
app.post('/aparecidabot/webhook', messageWebhook);

app.post('/aparecidabot/github', (req, res) => {
    let sender = req.body.sender;
    let branch = req.body.ref;
    let githubUsername = "anuardaher"

    if (branch.indexOf('master') > -1 && sender.login === githubUsername) {
        deploy(res);
    }
})

const deploy = (res) => {
    childProcess.exec('cd /home && ./deploy.sh', function(err, stdout, stderr) {
        if (err) {
            console.error(err);
            return res.send(500);
        }
        res.send(200);
    });
}

module.exports = app;