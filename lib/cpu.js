'use strict'

var _ = require('underscore');
var access = require('object-path').get;
var createVmstats = require('vmstat-s');

var cpuUsedArray = [];
var cpuStolenArray = [];
var lastRecord = null;

var config = require('./config');
var intervalInSeconds = access(config, ['cpuDetailedIntervalSeconds'], 10); // default 10 seconds.

createVmstats().then(function(vmstats) {
    lastRecord = vmstats.getLastData();
    setTimeout(hb, intervalInSeconds * 1000);
    function hb() {
        setTimeout(hb, intervalInSeconds * 1000);
        vmstats.next().then(function(data) {
            lastRecord = data;
            cpuUsedArray.push(data.summary.cpuUsed);
            cpuStolenArray.push(data.summary.cpuStolen || 0);
        });
    }
});

// return data object
function getCpuInfo() {
    var data = {};
    if (lastRecord) {
        data.memTotalMB = lastRecord.summary.memTotalMB;
        data.memPercent = lastRecord.summary.memUsagePercent;
        data.memMB = lastRecord.summary.memTotalMB - lastRecord.summary.memFreeMB - lastRecord.summary.memBufferMB;
    }
    if (cpuUsedArray.length > 0) {
        // cpuUsed
        var count = cpuUsedArray.length;
        var total = _.reduce(cpuUsedArray, function(memo, num) { return memo + num;}, 0);
        data.cpu = Math.round(total/count);
        data.cpuDetail = cpuUsedArray.join(',');
        
        // cpuStolen
        var totalStolen = _.reduce(cpuStolenArray, function(memo, num) { return memo + num;}, 0);
        if (totalStolen) {
            data.cpuStolen = Math.round(totalStolen/count);
            data.cpuStolenDetail = cpuStolenArray.join(',');
        }
        cpuUsedArray = [];
        cpuStolenArray = [];
    }
    return data;
}

module.exports = getCpuInfo;