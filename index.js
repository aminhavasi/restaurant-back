const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const httpServer = http.createServer(app);
//----------------------------------------------
require('dotenv').config();
const routes = require('./src/routes/index');

//------------------------

mongoose.connect(process.env.URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.use(express.json());
app.use('/', routes);

const port = process.env.PORT;
httpServer.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
