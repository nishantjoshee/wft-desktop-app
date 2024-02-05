const { updateSystemInfo } = require('./systemInfo');
const { updateSystemLog, writeSystemLog } = require('./systemLog');
const { ipcRenderer } = require('electron');
const { exec } = require('child_process');
const { checkLastCommand, updateLastCommand, clearLastCommand } = require("./lastCommand")


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
      .then(async (output) => {
        const successLog = `Remote network adapter restart success at : ${new Date()}`
        await writeSystemLog(successLog);
        await updateSystemLog();
        console.log('Command output', output);
      })
      .catch(async (error) => {
        const errorLog = `Remote network adapter restart error at : ${new Date()}`;
        await writeSystemLog(errorLog);
        await updateSystemLog();
        console.error('Error executing command', error);
      });
  }

  if (arg.command == 'shutdown-system') {
    executePowershell('Stop-Computer -ComputerName localhost')
      .then(async (output) => {
        const successLog = `Remote system shutdown success at : ${new Date()}`
        await writeSystemLog(successLog);
        await updateSystemLog();
        console.log('Command output', output);
      })
      .catch(async (error) => {
        const errorLog = `Remote system shudown error at : ${new Date()}`;
        await writeSystemLog(errorLog);
        await updateSystemLog();
        console.error('Error executing command', error);
      });
  }

  if (arg.command == 'restart-system') {
    executePowershell('Restart-Computer')
      .then(async (output) => {
        const successLog = `Remote system restart success at : ${new Date()}`
        await writeSystemLog(successLog);
        await updateSystemLog();
        console.log('Command output', output);
      })
      .catch(async (error) => {
        const errorLog = `Remote system restart error at : ${new Date()}`;
        await writeSystemLog(errorLog);
        await updateSystemLog();
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
  lastCommand();
};

async function lastCommand() {
  if (navigator.onLine) {
    await clearLastCommand();
  }
  if (!navigator.onLine) {
    const lastCommand = await checkLastCommand();
    if (!lastCommand) {
      // restart adapter
      if (lastCommand == 'restart-network-adapters') {
        executePowershell('Get-NetAdapter | Restart-NetAdapter -Confirm:$false')
          .then(async (output) => {
            const successLog = `Remote network adapter restart success at : ${new Date()}`
            await writeSystemLog(successLog);
            await updateSystemLog();
            await updateLastCommand("adapter-restart");
            console.log('Command output', output);
          })
          .catch(async (error) => {
            const errorLog = `Remote network adapter restart error at : ${new Date()}`;
            await writeSystemLog(errorLog);
            await updateSystemLog();
            console.error('Error executing command', error);
          });
      }


    }
    if (lastCommand == "adapter-restart") {
      // restart system
      executePowershell('Restart-Computer')
      .then(async (output) => {
        const successLog = `Remote system restart success at : ${new Date()}`
        await writeSystemLog(successLog);
        await updateSystemLog();
        await updateLastCommand("system-restart");
        console.log('Command output', output);
      })
      .catch(async (error) => {
        const errorLog = `Remote system restart error at : ${new Date()}`;
        await writeSystemLog(errorLog);
        await updateSystemLog();
        console.error('Error executing command', error);
      });
    }
    if (lastCommand == "system-restart") {
      // do nothing
    }
  }

}



window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

updateOnlineStatus();
