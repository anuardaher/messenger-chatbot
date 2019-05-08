module.exports = class Answer {

    constructor(_response, _quick_reply) {
        Object.assign(this, { _response, _quick_reply })
    }

    getTextResponse() {
        return this._response
    }

    getQuick_reply() {
        return this._quick_reply;
    }
}