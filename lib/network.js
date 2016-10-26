'use strict'

var _ = require('underscore');
var Promise = require('bluebird').Promise;
var create = require('./ifconfig');

var ifconfig = null;

create().then(function(instance) {
    ifconfig = instance;
});

// return a promise
function getNetworkInfo() {
    if (!ifconfig) {
        return Promise.resolve({});
    } else {
        return ifconfig()
            .then(function(data) {
                // console.dir(data);
                return data.summary;
            });
    }
}

module.exports = getNetworkInfo;