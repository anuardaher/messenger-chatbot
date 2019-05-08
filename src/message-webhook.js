const { WebhookClient } = require('dialogflow-fulfillment')
const { Payload } = require('dialogflow-fulfillment')
const { Suggestion } = require('dialogflow-fulfillment')
const localizaProcesso = require("../src/modules/processModule")
const realizaDenuncia = require("../src/modules/denunciaModule")
const consultaDenuncia = require("../src/modules/consultaDenunciaModule")

module.exports = (request, response) => {
    if (!dialogflowAuth(request.headers.authorization)) return response.status(403);

    const agent = new WebhookClient({ request, response });

    let webPlatform = agent.originalRequest.source ? false : true;

    const chooseModule = async() => {
        let answer, context;

        switch (agent.intent) {
            case 'protocolo_processa_numero':
                context = agent.getContext('protocolo-followup')
                answer = await localizaProcesso(agent.query, context);
                break;
            case 'denunciar_som_alto - custom - yes':
                let address = agent.contexts.pop();
                answer = await realizaDenuncia(address.parameters);
                break;
            case 'consultar_denuncia - custom':
                context = agent.getContext('consultar_denuncia-followup')
                answer = await consultaDenuncia(agent.query, context);
                break;
            default:
                console.warn(intent);
                answer = "Não foi possível realizar essa operação. Tente mais tarde."
                break;
        }
        setResponse(answer);
    }

    const setResponse = (answer) => {

        if (webPlatform) {
            agent.add(new Payload('PLATFORM_UNSPECIFIED', webResponse(answer)));
        } else {
            agent.add(appsResponse(answer))
        }
    }

    let intentMap = new Map();
    intentMap.set(agent.intent, chooseModule)
    agent.handleRequest(intentMap);

}

const webResponse = (answer) => {

    let response = [{
        "message": answer.getTextResponse(),
        "platform": "kommunicate",
    }]
    if (answer.getQuick_reply()) {
        let quickReplyButtons = {
            "message": answer.getQuick_reply().title,
            "platform": "kommunicate",
            "metadata": {
                "contentType": "300",
                "templateId": "6",
                "payload": [{
                        "title": "Sim",
                        "message": answer.getQuick_reply().reply
                    },
                    {
                        "title": "Não",
                        "message": "Sair"
                    },
                    {
                        "title": "Menu Inicial",
                        "message": "Menu Inicial"
                    }
                ]
            }
        }
        response.push(quickReplyButtons);
    }
    return response;
}

const appsResponse = (answer) => {

    let response = [answer.getTextResponse()]
    if (answer.getQuick_reply()) {
        let suggestion = new Suggestion(answer.getQuick_reply());
        suggestion.addReply_("Menu Inicial");
        suggestion.addReply_("Sair");
        response.push(suggestion);
    }
    return response;
}

const dialogflowAuth = (auth) => {
    if (!auth) return false;
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    let pass = "anuar:z8gr922g";
    if (credentials != pass) return false

    return true;
}