'use strict'

var Promise = require('bluebird').Promise;
var exec = Promise.promisify(require('child_process').exec);

function addIpAddr() {
    var data = {};

    return exec("hostname -I | awk '{print $1}'").then(function(stdout) {
        data.intIpAddr = stdout.replace(/\n$/, ''); // remove ending \n
        return exec("curl ifconfig.me").then(function(stdout) {
        	data.extIpAddr = stdout.replace(/\n$/, ''); // remove ending \n
	        return data;
        });
    }).timeout(2000).catch(function(err) {
    	console.log("failed to get ipAddr err=" + err);
    	return data;
    });
}

module.exports = addIpAddr;
