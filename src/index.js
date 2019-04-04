require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const bodyParser = require('body-parser');
const messageWebhook = require('./message-webhook');

const app = express();
let port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.status(200).send("Olá! Sou um chatbot!")
})
app.post('/webhook', messageWebhook);

app.listen(port, () => console.log(`Express server is listening on port ${port}`));