const denunciaModel = require("../models/denunciaModel");
const Answer = require("../answerClass")

module.exports = async(protocolNumber, context) => {
    let denuncia;
    let tryAgainMessage = "Número de denuncia inválido. Verifique se o número está correto e tente novamente"
    let quickReply = { title: "Deseja continuar tentando?", reply: "Consultar" }

    if (isNaN(protocolNumber)) {
        if (context.lifespan) {
            return new Answer(tryAgainMessage);
        }
        return new Answer(tryAgainMessage, quickReply);
    }

    try {
        denuncia = await denunciaModel.findOne({ "protocolo": Number(protocolNumber) })
    } catch (e) {
        console.error(e.message);
        throw new Answer("Oops, tivemos um problema e não foi possível localizar o processo", quickReply)
    }


    if (!denuncia) {
        if (context.lifespan) {
            return new Answer("Não existe denúncia para esse protocolo. Confira se o número digitado está correto e tente novamente.")
        }
        return new Answer("Não existe denúncia para esse protocolo. Confira se o número digitado está correto e tente novamente.", quickReply)
    }

    let response = `Protocolo: ${denuncia.protocolo}.
Status: ${denuncia.status}.
Endereço: ${denuncia.endereco.rua || ''}, qd: ${denuncia.endereco.quadra || ''}, lt: ${denuncia.endereco.lote || ''}, ${denuncia.endereco.setor || ''}.`
    if (denuncia.observacao) {
        response = response.concat(`Observação: ${denuncia.observacao}.`)
    }

    return new Answer(response, {
        title: "Deseja consultar outra denúncia?",
        reply: "Consultar"
    });
}