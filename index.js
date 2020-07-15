const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const httpServer = http.createServer(app);
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
//----------------------------------------------
require('dotenv').config();
const routes = require('./src/routes/index');
const logger = require('./src/config/logger');

const corsOptions = {
    exposedHeaders: 'x-auth , x-access',
};
const requestLogger = fs.createWriteStream(
    path.join(__dirname, 'src/log/requests.log'),
    { flags: 'a' }
);
app.use(
    morgan('combined', {
        stream: requestLogger,
    })
);
//------------------------

mongoose.connect(process.env.URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
app.use(cors(corsOptions));

app.use(express.json());
app.use('/', routes);

const port = process.env.PORT;
httpServer.listen(port, () => {
    logger.info(`server is running on port ${port}`);
});
