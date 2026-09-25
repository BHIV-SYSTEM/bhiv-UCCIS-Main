module.exports = function(io) {

  io.on("connection", (socket) => {

    console.log("Operator Connected");

    setInterval(() => {

      socket.emit("telemetry", {
        cpu: Math.floor(Math.random() * 100),
        replayLoad: Math.floor(Math.random() * 100),
        operators: Math.floor(Math.random() * 20),
        timestamp: Date.now()
      });

    }, 2000);

  });

};