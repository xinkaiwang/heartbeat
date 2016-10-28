'use strict'

var lsbRelease = require('lsb-release');
var access = require('object-path').get;

var info = null;
lsbRelease(function (_, data) {
    //console.dir(data);
    info = data;
});

function getLinuxRelease() {
    return {
        os: access(info, ['description']) // 'Fedora release 14 (Laughlin)' or 'Ubuntu 16.04.1 LTS'
    };
}

module.exports = getLinuxRelease;