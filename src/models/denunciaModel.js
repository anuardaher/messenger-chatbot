const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

let Schema = mongoose.Schema;

let denunciaSchema = new Schema({
    protocolo: Number,
    status: {
        type: String,
        enum: ['pendente', 'atendido'],
        default: "pendente"
    },
    endereco: {
        rua: String,
        quadra: Number,
        lote: Number,
        setor: String
    },
    observacao: String
})

autoIncrement.initialize(mongoose.connection)

denunciaSchema.plugin(autoIncrement.plugin, {
    model: 'Denuncia',
    field: 'protocolo',
    startAt: 1000,
    incrementBy: 1
});

module.exports = mongoose.model('Denuncia', denunciaSchema);