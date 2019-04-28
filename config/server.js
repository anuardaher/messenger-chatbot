const app = require('./express')

let port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Express server is listening on port ${port}`));