const replayService =
  require("./replay.service");

exports.replayTrace =
  async (req, res) => {
    const data =
      replayService.replayTrace(
        req.params.traceId
      );

    res.json(data);
  };

exports.replayAll =
  async (req, res) => {
    const data =
      replayService.replayAll();

    res.json(data);
  };