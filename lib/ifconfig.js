'use strict'

var _ = require('underscore');
var s = require('underscore.string');
var ifconfig = require('ifconfig-linux');
var Promise = require('bluebird');
var get = require('object-path').get;
var set = require('object-path').set;

function compareDiff(lastData, newData) {
    var result = {};
    var totalRxBytes = 0;
    var totalTxBytes = 0;
    var totalRxPackets = 0;
    var totalTxPackets = 0;
    _.each(newData, function(value, key) {
        if (s.startsWith(key, 'eth') || s.startsWith(key, 'wlan') || s.startsWith(key, 'enp')) { // 'eth0', 'wlan0', etc.
            // rxBytes
            var rxBytes = getDiff([key, 'rx','bytes']);
            set(result, [key, 'rxBytes'], rxBytes);
            totalRxBytes += rxBytes;
            // txBytes
            var txBytes = getDiff([key, 'tx','bytes']);
            set(result, [key, 'txBytes'], txBytes);
            totalTxBytes += txBytes;
            // rxPackets
            var rxPackets = getDiff([key, 'rx','packets']);
            set(result, [key, 'rxPackets'], rxPackets);
            totalRxPackets += rxPackets;
            // txPackets
            var txPackets = getDiff([key, 'tx','packets']);
            set(result, [key, 'txPackets'], txPackets);
            totalTxPackets += txPackets;
        }
    });

    function getDiff(accessPath) {
        return get(newData, accessPath, 0) - get(lastData, accessPath, 0);
    }
    var summary = {
        rxKByte: Math.round(totalRxBytes/1000.0),
        txKByte: Math.round(totalTxBytes/1000.0),
        rxPacket: totalRxPackets,
        txPacket: totalTxPackets
    };
    result.summary = summary;
    return result;
}

// return a promise
function create() {
    var lastData = null;
    return ifconfig().then(function(data) {
        lastData = data;
        return next;
    });

    // return a promise
    function next() {
        return ifconfig().then(function(data) {
            var result = compareDiff(lastData, data);
            lastData = data;
            return result;
        })
    }
}

module.exports = create;
