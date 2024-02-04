const  {updateSystemInfo}  = require("./systemInfo");
const {updateSystemLog}  = require("./systemLog");

const updateOnlineStatus = () => {

  document.getElementById('status').innerHTML = navigator.onLine ? 'online' : 'offline'
  updateSystemLog()
  updateSystemInfo()

}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

updateOnlineStatus()