const { ipcRenderer } = require("electron");
const fs = require('fs');
const osu = require('os-utils');
const os = require('os');
const filePath = './log.json';
const {updateSystemInfo} = require("./systemInfo")
const {updateSystemLog} = require("./systemLog");


const updateOnlineStatus = () => {

  document.getElementById('status').innerHTML = navigator.onLine ? 'online' : 'offline'
  updateSystemLog()
  updateSystemInfo()

}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

updateOnlineStatus()