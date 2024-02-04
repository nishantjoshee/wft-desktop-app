const osu = require("os-utils");
const os = require("os");

function updateSystemInfo () {
    setInterval(() => {
        osu.cpuUsage(function (v) {
          let cpuUsage = (v * 100).toFixed(2);
    
          if(cpuUsage < 50) {
            document.getElementById('cpu').innerHTML = `<button type="button" class="btn btn-outline-primary" style="width: 150px;">${cpuUsage} % </button>`
          }
          if (cpuUsage > 50 && cpuUsage < 80) {
            document.getElementById('cpu').innerHTML = `<button type="button" class="btn btn-outline-warning" style="width: 150px;">${cpuUsage} % </button>`
          }
          if(cpuUsage > 80){
            document.getElementById('cpu').innerHTML = `<button type="button" class="btn btn-outline-danger" style="width: 150px;">${cpuUsage} % </button>`
          }
    
        });
        let freeMemory = (osu.freememPercentage() * 100).toFixed(2);
        let memoryButtonClass = "btn btn-outline-primary"
        if(freeMemory > 30) {
          memoryButtonClass = "btn btn-outline-primary"
        }
        if(freeMemory < 30 && freeMemory > 10){
          memoryButtonClass = "btn btn-outline-warning"
        }
        if(freeMemory < 10) {
          memoryButtonClass = "btn btn-outline-danger"
        }
        document.getElementById('memory').innerHTML = `<button type="button" class="${memoryButtonClass}" style="width: 150px;">${freeMemory} % </button>`
    
        document.getElementById("platform").innerText = os.platform()
      }, 1000)
}
module.exports = {updateSystemInfo}