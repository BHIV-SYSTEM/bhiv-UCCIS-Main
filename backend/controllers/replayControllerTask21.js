exports.getReplay = async (req, res) => {
  res.json([
    {
      time: "10:00 AM",
      event: "Escalation Triggered"
    },
    {
      time: "10:15 AM",
      event: "Replay Captured"
    }
  ]);
};