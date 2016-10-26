'use strict'

var _ = require('underscore');
var hostName = require('./hostName');
var network = require('./network');

var data = {};
_.extend(data, hostName());
network().then(function(networkSummary) {
    _.extend(data, networkSummary);
    console.dir(data);
});

