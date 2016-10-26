#!/usr/bin/env node

'use strict'
var _ = require('underscore');
var hostName = require('./lib/hostName');
var cpu = require('./lib/cpu');
var heartbeatInterval = 20; // 60 seconds
var network = require('./lib/network');

function collectData() {
    setTimeout(collectData, heartbeatInterval*1000);
    var data = {};
    //_.extend(data, hostName());
    _.extend(data, cpu());

    network().then(function(networkSummary) {
        _.extend(data, networkSummary);
        console.dir(data);
    });
}

setTimeout(collectData, 100);