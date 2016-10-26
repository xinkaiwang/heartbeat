// Don't modify config.default.json, instead make a copy to your own config.json and modify there.
// All values in config.json will override values in config.default.json

module.exports = {
    "heartbeatIntervalSeconds": 60,
    "cpuDetailedIntervalSeconds": 10,
    "rainUploadEnabled": true,
    "rainServiceUrl": "http://your-rain-service.com/heartbeat"
};