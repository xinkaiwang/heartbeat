var Promise = require('bluebird').Promise;
var exec = Promise.promisify(require('child_process').exec);

var needMeasurePiTemp = true;
function measureCpuTempreture() {
  var data = {};

  if (!needMeasurePiTemp) {
    return {};
  }

  return exec("vcgencmd measure_temp").then(function (stdout) {
    // stdout = temp=35.0'C
    var tempreture = stdout.replace(/\'C\n$/, ''); // remove ending \n
    tempreture = tempreture.replace(/temp=/, '');
    data.cpuTemp = parseFloat(tempreture);
    return data;
  }).timeout(2000).catch(function (err) {
    console.log("failed to measure cpu tempreature (pi)" +
      ", Disabling PiTemp to avoid further noise. " +
      " err=" + err);
    needMeasurePiTemp = false;
    return data;
  });
}

module.exports = measureCpuTempreture;
