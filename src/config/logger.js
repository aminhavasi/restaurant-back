const { createLogger, format, transports } = require('winston');
const logger = createLogger({
    transports: [
        new transports.File({
            filename: './src/log/serverRuning.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
        }),
        new transports.Console({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
        }),
    ],
});

module.exports = logger;
