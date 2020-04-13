'use strict'

var os = require('os');

var hostName = os.hostname();
var arch = os.arch();
var osType = os.type();
var totalMemory = os.totalmem();
var platform = os.platform();
var release = os.release();
var k8sClasterIp = process.env.KUBERNETES_SERVICE_HOST;

var startTime = Date.now();

function addHostName() {
    var data = {};
    data.pod = hostName;
    data.arch = arch;
    data.k8s = k8sClasterIp;
    //data.os = osType; // 'linux'
    data.osPlatform = platform; // 'linux'
    data.osRelease = release; // '3.13.0-79-generic'
    data.totalMemoryMB = Math.round(totalMemory / (1024. * 1024.));
    var uptimeSec = Math.round((Date.now() - startTime)/1000);
    data.uptimeMinutes = Math.round(uptimeSec/60.0);
    return data;
}

module.exports = addHostName;