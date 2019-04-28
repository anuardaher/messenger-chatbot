const express = require('express');
const messageWebhook = require('../src/message-webhook');
require("../config/database")("mongodb://admin:z8gr922g@ds021172.mlab.com:21172/aparecida-chatbot")

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname || process.env.NODE_ENV, { dotfiles: 'allow' }))

app.get('/', (req, res) => {
    res.status(200).send("Olá! Sou um chatbot!")
})
app.post('/webhook', messageWebhook);

module.exports = app;