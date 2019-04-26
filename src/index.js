const express = require('express');
const bodyParser = require('body-parser');
const messageWebhook = require('./message-webhook');
require("../config/database")("mongodb://admin:z8gr922g@ds021172.mlab.com:21172/aparecida-chatbot")

const app = express();
let port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.status(200).send("Olá! Sou um chatbot!")
})
app.post('/webhook', messageWebhook);

app.listen(port, () => console.log(`Express server is listening on port ${port}`));