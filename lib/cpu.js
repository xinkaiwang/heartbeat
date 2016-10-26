'use strict'

var _ = require('underscore');
var createVmstats = require('vmstat-s');
var intervalInSeconds = 10;

var cpuUsedArray = [];
var cpuStolenArray = [];
var lastRecord = null;
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
        _.extend(data, _.pick(lastRecord.summary, 'upTimeInSeconds', 'memTotalMB', 'memUsagePercent'));
        data.memUsedMB = lastRecord.summary.memTotalMB - lastRecord.summary.memFreeMB - lastRecord.summary.memBufferMB;
    }
    if (cpuUsedArray.length > 0) {
        // cpuUsed
        var count = cpuUsedArray.length;
        var total = _.reduce(cpuUsedArray, function(memo, num) { return memo + num;}, 0);
        data.cpuAvg = Math.round(total/count);
        data.cpuDetail = cpuUsedArray.join(',');
        
        // cpuStolen
        var totalStolen = _.reduce(cpuStolenArray, function(memo, num) { return memo + num;}, 0);
        if (totalStolen) {
            data.cpuStolenAvg = Math.round(total/count);
            data.cpuStolenDetail = cpuUsedArray.join(',');
        }
        cpuUsedArray = [];
        totalStolen = [];
    }
    return data;
}

module.exports = getCpuInfo;