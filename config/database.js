const mongoose = require("mongoose");

module.exports = (uri) => {

    mongoose.connect(uri, { useNewUrlParser: true });
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

    mongoose.connection.on('connected', function() {
        console.log('Mongoose! Conectado em ' + uri);
    });
}