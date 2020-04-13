'use strict'

var _ = require('underscore');
var promisify = require('bluebird').promisify;
var exec = promisify(require('child_process').exec);

// var access = require('object-path').get;
// var createVmstats = require('vmstat-s');

// https://unix.stackexchange.com/questions/243484/how-do-i-convert-the-output-of-ps1-to-json
var cmd = 'ps -o "%p %x %a"| jq -sR \'[sub("\n$";"") | splits("\n") | sub("^ +";"") | [splits(" +")]] | .[0] as $header | .[1:] | [.[] | [. as $x | range($header | length) | {"key": $header[.], "value": $x[.]}] | from_entries]\'';

function ps_cpu() {
  return exec(cmd).then(function (stdout, stderr) {
    // console.log("ps_cpu=" + stdout);
    return JSON.parse(stdout);
  });
}

var cmd_mem = 'ps xu| jq -sR \'[sub("\n$";"") | splits("\n") | sub("^ +";"") | [splits(" +")]] | .[0] as $header | .[1:] | [.[] | [. as $x | range($header | length) | {"key": $header[.], "value": $x[.]}] | from_entries]\'';
function ps_mem() {
  return exec(cmd_mem).then(function (stdout, stderr) {
    // console.log("ps_mem=" + stdout);
    return JSON.parse(stdout);
  });
}

// '00:01:02' => 62
function parseTimeToSeconds(timeStr) {
  if (!timeStr) {
    return 0;
  }
  var split = timeStr.split(':');
  var val = 0;
  for (var idx in split) {
    val = val * 60;
    val += parseInt(split[idx]);
  }
  return val;
}

// console.log(parseTimeToSeconds('01:02:03'));

function arrayToDict(array, func) {
  var map = {};
  for (var idx in array) {
    var key = func(array[idx]);
    map[key] = array[idx];
  }
  return map;
}

var dict = {}; // key is PID, value is object {PID, TIME, COMMAND, etc...}
function getCpuSecondsSinceLastCall() {
  return ps_cpu().then(function (result) {
    var totalTimeSec = 0;
    var newItems = arrayToDict(result, function (item) {return parseInt(item.PID);});
    for (var pid in newItems) {
      var item = newItems[pid];
      item.timeInSec = parseTimeToSeconds(item.TIME);
      if (pid in dict) {
        var oldItem = dict[pid];
        totalTimeSec += item.timeInSec - oldItem.timeInSec;
      } else {
        totalTimeSec += item.timeInSec;
        dict[pid] = item;
      }
    }
    dict = newItems;
    return totalTimeSec;
  });
}

var lastMemMap = {};
var vszKbArray = [];
var rssKbArray = [];
function getMemUsage() {
  return ps_mem().then(function (memResult) {
    var memMap = arrayToDict(memResult, function (item) {return parseInt(item.PID);});
    lastMemMap = memMap;
    var vsz = 0;
    var rss = 0;
    for (var pid in dict) {
      if (pid in memMap) {
        vsz += parseInt(memMap[pid].VSZ);
        rss += parseInt(memMap[pid].RSS);
      }
    }
    vszKbArray.push(vsz);
    rssKbArray.push(rss);
  });
}

var cpuUsedArray = [];
var intervalSec = 10; // 10s
function timeout() {
  getCpuSecondsSinceLastCall().then(function (cpuSecond) {
    cpuUsedArray.push(cpuSecond);
  }).then(getMemUsage)
  .finally(function() {
    setTimeout(timeout, intervalSec * 1000);
  });
}
timeout();

// return data object
function getCpuInfo() {
  var data = {};
  if (cpuUsedArray.length > 0) {
      // cpuUsed
      var total = _.reduce(cpuUsedArray, function(memo, num) { return memo + num;}, 0);
      data.cpu = total;
      data.cpuDetail = cpuUsedArray.join(',');
      
      cpuUsedArray = [];
  }
  if (vszKbArray.length > 0) {
    // console.log('vszKbArray=' + vszKbArray);
    data.vszMb = Math.round(_.last(vszKbArray)/1024.0);
    // data.vszKb = _.last(vszKbArray);
    vszKbArray = [];
  }
  if (rssKbArray.length > 0) {
    // console.log('rssKbArray=' + rssKbArray);
    data.rssMb = Math.round(_.last(rssKbArray)/1024.0);
    // data.rssKb = _.last(rssKbArray);
    data.rssDetail = rssKbArray.map(val => Math.round(val/1024)).join(',');
    rssKbArray = [];
  }
  // data.processDetail = JSON.stringify(dict);
  data.psxu = JSON.stringify(lastMemMap);
  return data;
}

module.exports = getCpuInfo;