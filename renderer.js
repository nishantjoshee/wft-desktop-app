const { updateSystemInfo } = require('./systemInfo');
const { updateSystemLog, writeSystemLog } = require('./systemLog');
const { ipcRenderer } = require('electron');
const { exec } = require('child_process');

function executePowershell(command) {
  return new Promise((resolve, reject) => {
    exec(`powershell.exe -Command "${command}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

ipcRenderer.on('remote-command', (event, arg) => {
  if (arg.command == 'restart-network-adapters') {
    executePowershell('Get-NetAdapter | Restart-NetAdapter -Confirm:$false')
      .then((output) => {
        console.log('Command output', output);
      })
      .catch((error) => {
        console.error('Error executing command', error);
      });
  }

  if (arg.command == 'shutdown-system') {
    executePowershell('Stop-Computer -ComputerName localhost')
      .then((output) => {
        console.log('Command output', output);
      })
      .catch((error) => {
        console.error('Error executing command', error);
      });
  }

  if (arg.command == 'restart-system') {
    executePowershell('Restart-Computer')
      .then((output) => {
        console.log('Command output', output);
      })
      .catch((error) => {
        console.error('Error executing command', error);
      });
  }
});

// ipcRenderer.on('remote-connection-status', (event, arg) => {
//   console.log(arg, 'test');
//   document.getElementById(
//     'remote-connection-status'
//   ).innerText = `Remote Connection Status : ${arg}`;
// });

const updateOnlineStatus = async () => {
  document.getElementById('status').innerHTML = navigator.onLine
    ? 'Internet Connection Status : Online'
    : 'Internet Connection Status : Offline';
  var internetLog = navigator.onLine
    ? `Internet Connected at : ${new Date()}`
    : `Internet Disconnected at : ${new Date()}`;
  await writeSystemLog(internetLog);
  await updateSystemLog();
  updateSystemInfo();
};

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

updateOnlineStatus();
