module.exports = class Answer {

    constructor(_response, _quick_reply) {
        this._response = _response;
        this._quick_reply = _quick_reply
    }

    getTextResponse() {
        return this._response
    }

    getQuick_reply() {
        return this._quick_reply;
    }
}