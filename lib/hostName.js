'use strict'

var os = require('os');

var hostName = os.hostname();
var arch = os.arch();
var osType = os.type();
var totalMemory = os.totalmem();
var platform = os.platform();
var release = os.release();

function addHostName() {
    var data = {};
    data.host = hostName;
    data.arch = arch;
    data.os = osType;
    //data.osPlatform = platform;
    data.osRelease = release;
    data.totalMemoryMB = Math.round(totalMemory / (1024. * 1024.));
    var uptime = os.uptime();
    data.uptimeInMinutes = Math.round(uptime/60.0);
    return data;
}

module.exports = addHostName;