const { Suggestion } = require('dialogflow-fulfillment')

module.exports = class Answer {

    constructor(_response, _quick_reply) {
        this._response = _response;
        this._quick_reply = _quick_reply
    }

    getResponse() {
        return this._response
    }

    getQuick_reply() {
        if (!this._quick_reply) return false;

        let suggestion = new Suggestion(this._quick_reply);
        suggestion.addReply_("Menu Inicial");
        suggestion.addReply_("Sair")
        return suggestion;
    }
}