'use strict'

var hostName = require('./hostName');

var data = {};
hostName(data);

console.log(JSON.stringify(data));
