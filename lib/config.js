'use strict'

var _ = require('underscore');
var defaultConfig = require('../config.default.js');
var customConfig;
try {
    customConfig = require('../config.js');
} catch(e) {
    // do nothing.
}

var config = _.clone(defaultConfig);
if (customConfig) {
    _.extend(config, customConfig);
}

module.exports = config;