const axios = require("axios")
const Answer = require("../answerClass")

module.exports = async(processo_numero) => {
    let token, processo;
    if (processo_numero.length != 10 || isNaN(processo_numero))
        return new Answer("Número de protocolo inválido. Verifique se o número está correto")
    try {
        token = await getAuthToken();
        processo = await getProcessoData(token, processo_numero);
    } catch (e) {
        throw new Error(e)
    }
    return setProcessoAnswer(processo);
}

const getAuthToken = async() => {
    const url = "https://sigp.aparecida.go.gov.br/sig/rest/loginController/validarLoginParaModuloPublico?modulo=servicosonline";
    let response;
    try {
        response = await axios.get(url);
    } catch (e) {
        throw new Error(e)
    }

    if (!response.data) {
        throw new Error("Não foi possível obter o token")
    }
    return response.data.token
}

const getProcessoData = async(token, numero_processo) => {
    let response;
    const url = 'https://sigp.aparecida.go.gov.br/sig/rest/processoController/pesquisarDetalhesProcesso'
    let body = { "numero_processo": parseInt(numero_processo) }
    let config = {
        method: 'post',
        data: body,
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
    }
    try {
        response = await axios.post(url, body, config)
    } catch (e) {
        throw new Error(e)
    }

    if (!response.data || response.data.length < 1) {
        console.error("Array de andamento dos processos está vazio");
        return { customError: "Este processo ainda não deixou seu local de origem." }
    }
    return response.data.shift();
}

const setProcessoAnswer = (processo) => {
    let response;
    if (!processo.numero_processo)
        response = processo.customError
    else
        response = `Processo: ${processo.numero_processo}.
Remessa: ${processo.numero_remessa || ''}.
Assunto: ${processo.assunto || ''}.
Data da Remessa: ${processo.data_remessa || ''}.
Destino: ${processo.destino || ''}`

    let quick_reply = {
        title: "Deseja localizar outro processo?",
        reply: "Localizar"
    }

    return new Answer(response, quick_reply);
}