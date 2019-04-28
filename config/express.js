const express = require('express');
const bodyParser = require('body-parser');
const messageWebhook = require('../src/message-webhook');
require("../config/database")("mongodb://admin:z8gr922g@ds021172.mlab.com:21172/aparecida-chatbot")

const app = express()

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname, { dotfiles: 'allow'}))

app.get('/', (req, res) => {
    res.status(200).send("Olá! Sou um chatbot!")
})
app.post('/webhook', messageWebhook);

module.exports = app;
