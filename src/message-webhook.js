const { WebhookClient } = require('dialogflow-fulfillment')

const processModule = require("../src/modules/processModule")
const denunciaModule = require("../src/modules/denunciaModule")
const consultaDenunciaModule = require("../src/modules/consultaDenunciaModule")

module.exports = (request, response) => {
    let body = request.body
    if (!body.queryResult) return;
    let intent = body.queryResult.intent.displayName;

    const setAnswer = async() => {
        let answer;

        switch (intent) {
            case 'protocolo_processa_numero':
                answer = await processModule(body.queryResult.queryText);
                break;
            case 'denunciar_som_alto - custom - yes':
                let address = body.queryResult.outputContexts.pop();
                answer = await denunciaModule(address.parameters);
                break;
            case 'consultar_denuncia - custom':
                answer = await consultaDenunciaModule(body.queryResult.queryText);
                break;
            default:
                console.warn(intent);
                answer = "Não foi possível realizar essa operação. Tente mais tarde."
                break;
        }
        sendResponse(answer);
    }

    const sendResponse = (answer) => {
        agent.add(answer.getResponse());

        if (answer.getQuick_reply())
            agent.add(answer.getQuick_reply());
    }

    const agent = new WebhookClient({ request, response });

    let intentMap = new Map();
    intentMap.set(intent, setAnswer)
    agent.handleRequest(intentMap);
};