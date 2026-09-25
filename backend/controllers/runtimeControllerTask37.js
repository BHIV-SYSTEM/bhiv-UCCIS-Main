const runtimeService =
require(
"../services/runtimeEngine/runtimeService"
);

exports.getRuntime =
(req, res) => {

res.json(
runtimeService.getRuntimeStatus()
);

};