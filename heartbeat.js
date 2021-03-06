#!/usr/bin/env node

'use strict'
var _ = require('underscore');

function getInK8s() {
  return !!process.env.KUBERNETES_SERVICE_HOST;
}

var isInK8s = getInK8s();
// isInK8s = true; // for debug only
console.log('isInK8s=' + isInK8s);

var hostName = isInK8s?require('./lib/podName'):require('./lib/hostName');
var cpu = isInK8s?require('./lib/podCpu'):require('./lib/cpu');
var os = require('./lib/os');
var linuxRelease = require('./lib/linuxRelease');
var network = require('./lib/network');
var ipAddr = require('./lib/ipAddr');
var piCpuTemp = require('./lib/piCpuTemp');
var disk = require('./lib/disk');
var config = require('./config');

var heartbeatInterval = config.heartbeatIntervalSeconds || 60; // default 60 seconds

function logHeartbeat(hb) {
  console.dir(hb);
  if (config.rainUploadEnabled) {
    require('./lib/rainServiceClient')(hb); // This retuens a Promise, but we don't really care about result.
  }
}

var lastHeartbeatTime;
function collectData() {
  setTimeout(collectData, heartbeatInterval * 1000);
  var data = {
    event: 'hostAgent'
  };
  if (isInK8s) {
    data.event = 'podAgent';
  }
  _.extend(data, hostName()); // 'host', 'arch', 'totalMemoryMB', 'uptimeMinutes'
  _.extend(data, cpu());
  _.extend(data, os()); // 'cpuCount'
  _.extend(data, linuxRelease()); // 'osRelease'

  network()
    .then(function (networkSummary) {
      _.extend(data, networkSummary);
    })
    .then(ipAddr)
    .then(function (ipAddrSummary) {
      _.extend(data, ipAddrSummary);
    })
    .then(disk)
    .then(function (diskSummary) {
      _.extend(data, diskSummary);
    })
    .then(piCpuTemp)
    .then(function (piCpuTempSummary) {
      _.extend(data, piCpuTempSummary);
    })
    .then(function () {
      delete (data.upTimeInSeconds);
      var now = new Date().getTime();
      if (lastHeartbeatTime) {
        data.hbIntervalSeconds = Math.round((now - lastHeartbeatTime) / 1000.0);
      }
      lastHeartbeatTime = now;
      data.time = now;
    })
    .then(function () {
      logHeartbeat(data);
    });
}

setTimeout(collectData, 100);