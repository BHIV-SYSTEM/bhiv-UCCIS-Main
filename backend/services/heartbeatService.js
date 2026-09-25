const heartbeat = () => {
  setInterval(() => {
    console.log("Heartbeat ACTIVE");
  }, 3000);
};

module.exports = heartbeat;