const denunciaModel = require("../models/denunciaModel")
const Answer = require("../answerClass")

module.exports = async(address) => {
    let response;
    let quick_reply = { title: "Deseja realizar outra denúncia?", reply: "Denunciar" }
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
        console.error(e);
        return new Answer("Oops, tivemos um problema e não foi possível realizar a denúncia", { title: "Deseja tentar novamente?", reply: "Denunciar" })
    }

    response = `Sua denúncia foi realizada com sucesso. Protocolo número: ${newDenuncia.protocolo} `

    return new Answer(response, quick_reply);
}