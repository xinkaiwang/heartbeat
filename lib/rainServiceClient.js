'use strict'

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

var rainServiceUrl = require('./config').rainServiceUrl;

// return s promise
function postToRainService(hb) {
    var body = JSON.stringify(hb);
    //logger.info({event:'clientSend', postBody: hb});
    var opt = {
        url: rainServiceUrl,
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    };
    return request(opt).then(function(resp) {
        if (resp.statusCode !== 200) {
            console.log('event=httpPostDone remoteService=rain conclusion=fail payloadSize=' + body.length + ' statusCode=' + resp.statusCode);
            throw new Error(resp);
        } else {
            console.log('event=httpPostDone remoteService=rain conclusion=succ payloadSize=' + body.length);
        }
    });
}

module.exports = postToRainService;
