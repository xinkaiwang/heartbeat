#!/usr/bin/env node

'use strict'
var _ = require('underscore');
var hostName = require('./lib/ipAddr.js');

var data = {
    event: 'hostAgent'
};

hostName().then(function(obj) {
	_.extend(data, obj);
	console.dir(data);
});
 // 'host', 'arch', 'totalMemoryMB', 'uptimeMinutes'

