const fetch = require('node-fetch');
const { Url } = require('url');

// You can find your project ID in your Dialogflow agent settings
const projectId = 'daher-ec96d'; //https://dialogflow.com/docs/agents#settings
const sessionId = '123456';
const languageCode = 'en-US';
const dialogflow = require('dialogflow');

const config = {
    credentials: {
        private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
        client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
    }
};
const sessionClient = new dialogflow.SessionsClient(config);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const { FACEBOOK_ACCESS_TOKEN } = process.env;

// console.log(`Private Ket: ${config.credentials.private_key}
// Cliente Email: ${config.credentials.client_email}
// Facebook Token: ${FACEBOOK_ACCESS_TOKEN}`);

const sendTextMessage = (userId, text) => {
    console.log(`Mensagem retornada pelo Dialogflow: ${text}`);

    return fetch(
            `https://graph.facebook.com/v2.8/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    messaging_type: 'RESPONSE',
                    recipient: {
                        id: userId,
                    },
                    message: {
                        text,
                    },
                }),
            }
        ).then(res => {
            if (res.status != 200)
                console.error(`Mensagem não pôde ser enviada. ${res.status} ${res.statusText}`);
        })
        .catch(err => console.error(err));
}

module.exports = (event) => {
    const userId = event.sender.id;
    const message = event.message.text;

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: languageCode,
            },
        },
    };

    console.log(`Mensagem recebida: ${message}`);

    sessionClient
        .detectIntent(request)
        .then(responses => {
            const result = responses[0].queryResult;
            return sendTextMessage(userId, result.fulfillmentText);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}