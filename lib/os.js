'use strict'

var os = require('os');

function addOsInfo() {
    var data = {};
    var cpu = os.cpus();
    data.cpuCount = cpu.length;
    return data;
}

module.exports = addOsInfo;