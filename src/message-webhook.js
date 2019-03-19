const processMessage = require('./process-message');

module.exports = (req, res) => {
    let body = req.body;
    if (body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    console.log("ok")
                    processMessage(event);
                }
            });
        });

        res.status(200).end();
        return;
    }
    res.status(404).end();
};