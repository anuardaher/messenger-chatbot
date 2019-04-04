'use strict'

const { WebhookClient } = require('dialogflow-fulfillment')
const axios = require("axios")

module.exports = async(request, response) => {
    let body = request.body
    if (!body.queryResult) return;
    let processNumber = body.queryResult.queryText;

    let token = await getAuthToken();
    let process = await getProcessData(token, processNumber);

    const agent = new WebhookClient({ request, response });

    const setAnswer = () => {
        let answer = `Processo: ${process.numero_processo}
        Remessa: ${process.numero_remessa}
        Assunto: ${process.assunto}
        Data da Remessa: ${process.data_remessa}
        Destino: ${process.destino}
        Observação: ${process.observacao || ''}`

        agent.add(answer);
    }

    let intentMap = new Map();
    intentMap.set('protocolo_processa_numero', setAnswer)
    agent.handleRequest(intentMap);
};


const getAuthToken = async() => {
    const url = "https://sigp.aparecida.go.gov.br/sig/rest/loginController/validarLoginParaModuloPublico?modulo=servicosonline";
    let response;
    try {
        response = await axios.get(url);
    } catch (error) {
        return new Error(error);
    }

    if (!response.data) return console.error("Erro ao buscar token");
    return response.data.token;

}

const getProcessData = async(token, processNumber) => {
    let response;
    const url = 'https://sigp.aparecida.go.gov.br/sig/rest/processoController/pesquisarDetalhesProcesso'
    let body = { "numero_processo": parseInt(processNumber) }
    let config = {
        method: 'post',
        data: body,
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
    }
    try {
        response = await axios.post(url, body, config)
    } catch (error) {
        return new Error(error);
    }

    if (!response.data && response.data.length < 1) {
        console.error("Array de andamento dos processos está vazio");
        return;
    }
    return response.data.shift();
}