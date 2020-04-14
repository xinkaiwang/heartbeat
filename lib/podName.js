'use strict'

var os = require('os');
var _ = require('underscore');

var hostName = os.hostname();
var arch = os.arch();
var osType = os.type();
var totalMemory = os.totalmem();
var platform = os.platform();
var release = os.release();
var k8sClasterIp = process.env.KUBERNETES_SERVICE_HOST;

var startTime = Date.now();

// return data object
function parsePodName(fullName) {
    var split = fullName.split('-');
    if (split.length >= 3) {
        return {
            replicaSet: split[0] + '-' + split[1],
            podShortName: _.last(split),
        };
    } else {
        return {
            podShortName: _.last(split),
        };
    }
}

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

    _.extend(data, parsePodName(hostName));

    // adding value from env
    for (var key in process.env) {
        if (key.startsWith('MY_')) {
            data[key.substring(3)] = process.env[key];
        }
    }

    return data;
}

module.exports = addHostName;