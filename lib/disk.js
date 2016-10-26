'use strict'

var _ = require('underscore');
var Promise = require('bluebird').Promise;
var df = require('df');

// return object
function compileSummary(table) {
    var diskPercent = 0;
    _.each(table, function(disk) {
        diskPercent = Math.max(diskPercent, disk.percent);
    });
    return {
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