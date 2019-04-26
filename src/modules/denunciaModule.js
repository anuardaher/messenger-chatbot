const denunciaModel = require("../models/denunciaModel")
const Answer = require("../answerClass")

module.exports = async(address) => {

    let denuncia = {
        endereco: {
            rua: address.rua,
            quadra: address.quadra,
            lote: address.lote,
            setor: address.setor
        }
    }
    let newDenuncia;
    try {
        let denunciaInstace = new denunciaModel(denuncia);
        newDenuncia = await denunciaInstace.save()
    } catch (e) {
        throw new Error(e);
    }
    let quick_reply = {
        title: "Deseja realizar outra denúncia?",
        reply: "Denunciar"
    }

    let response = `Sua denúncia foi realizada com sucesso. Protocolo número: ${newDenuncia.protocolo} `

    return new Answer(response, quick_reply);
}