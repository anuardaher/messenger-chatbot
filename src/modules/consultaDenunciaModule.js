const denunciaModel = require("../models/denunciaModel");
const Answer = require("../answerClass")

module.exports = async(numero_protocolo) => {
    let denuncia;
    if (isNaN(numero_protocolo)) return new Answer("Número de protocolo inválido. Verifique se o número está correto");
    try {
        denuncia = await denunciaModel.findOne({ "protocolo": Number(numero_protocolo) })
    } catch (e) {
        console.error(e);
        throw new Error(e)
    }
    let quick_reply = {
        title: "Deseja consultar outra denúncia?",
        reply: "Consultar"
    }

    if (!denuncia) return new Answer("Não existe denúncia para esse protocolo. Confira se o número digitado está correto.", quick_reply)

    let response = `Protocolo: ${denuncia.protocolo}.
Status: ${denuncia.status}.
Endereço: ${denuncia.endereco.rua || ''}, qd: ${denuncia.endereco.quadra || ''}, lt: ${denuncia.endereco.lote || ''}, ${denuncia.endereco.setor || ''}.`
    if (denuncia.observacao) {
        response = response.concat(`Observação: ${denuncia.observacao}.`)
    }


    return new Answer(response, quick_reply);
}