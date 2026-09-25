const winston =
require("winston");

const loggerTask39 =
winston.createLogger({

  level: "info",

  format:
    winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),

  transports: [

    new winston.transports.Console(),

    new winston.transports.File({
      filename: "logs/runtime.log"
    })

  ]

});

module.exports = loggerTask39;