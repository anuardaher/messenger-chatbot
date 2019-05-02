const express = require('express');
const messageWebhook = require('../src/message-webhook');
const path = require('path')
require("../config/database")("mongodb://admin:z8gr922g@ds021172.mlab.com:21172/aparecida-chatbot")

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/aparecidabot", express.static("src/public"))

app.get('/aparecidabot', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/public/views/index.html'));
})
app.post('/aparecidabot/webhook', messageWebhook);

module.exports = app;
