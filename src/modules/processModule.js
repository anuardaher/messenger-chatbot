const axios = require("axios")
const Answer = require("../answerClass")

module.exports = async(processo_numero, context) => {
    let token, processo;

    if (processo_numero.length != 10 || isNaN(processo_numero)) {
        if (context.lifespan)
            return new Answer("Número de protocolo inválido. Verifique se o número está correto e tente novamente.")
        return new Answer("Número de protocolo inválido. Verifique se o número está correto e tente novamente.", {
            title: "Deseja continuar tentando?",
            reply: "Localizar"
        })
    }

    try {
        token = await getAuthToken();
        processo = await getProcessoData(token, processo_numero);
        return setProcessoAnswer(processo);
    } catch (e) {
        return new Answer(e.message, { title: "Deseja tentar novamente?", reply: "Localizar" })
    }
}

const getAuthToken = async() => {
    const url = "https://sigp.aparecida.go.gov.br/sig/rest/loginController/validarLoginParaModuloPublico?modulo=servicosonline";
    let response;
    try {
        response = await axios.get(url);
    } catch (e) {
        console.error(e.message);
        throw new Error("Oops, tivemos um problema e não foi possível localizar o processo");
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
        console.error(e.message);
        throw new Error("Oops, tivemos um problema e não foi possível localizar o processo")
    }

    if (!response.data || response.data.length < 1) {
        console.error("Array de andamento dos processos está vazio");
        throw new Error("Este processo ainda não deixou seu local de origem.")
    }

    return response.data.shift();
}

const setProcessoAnswer = (processo) => {
    let response;
    let quick_reply = {
        title: "Deseja localizar outro processo?",
        reply: "Localizar"
    }

    response = `Processo: ${processo.numero_processo}.
Remessa: ${processo.numero_remessa || ''}.
Assunto: ${processo.assunto || ''}.
Data da Remessa: ${processo.data_remessa || ''}.
Destino: ${processo.destino || ''}`

    return new Answer(response, quick_reply);
}