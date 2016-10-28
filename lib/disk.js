'use strict'

var _ = require('underscore');
var Promise = require('bluebird').Promise;
var df = require('df');

// return object
function compileSummary(table) {
  // table = [{filesystem: '/dev/vda1',
  //   blocks: 82303616,
  //   used: 22261936,
  //   available: 55814832,
  //   percent: 29,
  //   mountpoint: '/',
  //   type: 'ext4' },{},{},...]

    var diskPercent = 0;
    var diskUsedKB = 0;
    _.each(table, function(disk) {
        if (disk.filesystem.match(/\/dev\/mmcblk\dp\d/)) { // on raspberry pi, '/dev/mmcblk0p1' is a special boot device.
            // do nothing, skip
        } else {
            if (disk.percent > diskPercent) {
                diskPercent = disk.percent;
                diskUsedKB = disk.used;
            }
        }
    });
    return {
        diskUsedMB: Math.round(diskUsedKB/512), // npm df always use 'df -B 512'
        diskPercent: diskPercent
    };
}

// return a promise
function getDiskInfo() {
    return new Promise(function(resolve, reject) {
        df(function dfDone(err, table) {
            // console.dir(table);
            if (err) {
                reject(err);
            } else {
                resolve(compileSummary(table));
            }
        });
    });
}

module.exports = getDiskInfo;