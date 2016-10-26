#!/usr/bin/env node

'use strict'
var _ = require('underscore');
var hostName = require('./lib/hostName');
var cpu = require('./lib/cpu');
var network = require('./lib/network');
var disk = require('./lib/disk');
var config = require('./lib/config');

var heartbeatInterval = config.heartbeatIntervalSeconds || 60; // default 60 seconds

function logHeartbeat(hb) {
    console.dir(hb);
    if (config.rainUploadEnabled) {
        require('./lib/rainServiceClient')(hb); // This retuens a Promise, but we don't really care about result.
    }
}

var lastHeartbeatTime;
function collectData() {
    setTimeout(collectData, heartbeatInterval*1000);
    var data = {};
    _.extend(data, hostName());
    _.extend(data, cpu());

    network()
    .then(function(networkSummary) {
        _.extend(data, networkSummary);
    })
    .then(disk)
    .then(function(diskSummary) {
        _.extend(data, diskSummary);
    })
    .then(function() {
        delete(data.upTimeInSeconds);
        var now = new Date().getTime();
        if (lastHeartbeatTime) {
            data.hbIntervalSeconds = Math.round((now - lastHeartbeatTime)/1000.0);
        }
        lastHeartbeatTime = now;
        data.time = now;
    })
    .then(function() {
        logHeartbeat(data);
    });
}

setTimeout(collectData, 100);