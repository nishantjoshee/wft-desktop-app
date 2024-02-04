const  {updateSystemInfo}  = require("./systemInfo");
const {updateSystemLog}  = require("./systemLog");
const {ipcRenderer} = require("electron");

ipcRenderer.on("remote-command", (event, arg) => {
  console.log(arg.command);
});

ipcRenderer.on("remote-connection-status", (event, arg) => {
  document.getElementById("remote-connection-status").innerText = `Remote Connection Status : ${arg}`
})


const updateOnlineStatus = () => {

  document.getElementById('status').innerHTML = navigator.onLine ? 'Internet Connection Status : Online' : 'Internet Connection Status : Offline'
  updateSystemLog()
  updateSystemInfo()

}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

updateOnlineStatus()