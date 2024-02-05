const { updateSystemInfo } = require('./systemInfo');
const { updateSystemLog, writeSystemLog } = require('./systemLog');
const { ipcRenderer } = require('electron');
const { exec } = require('child_process');
const {
  restartAdapterLocally,
  restartAdapterRemotely,
  restartSystemLocally,
  restartSystemRemotely,
  shutdownSystemLocally,
  shutdownSystemRemotely,
} = require('./commands');
const {
  checkLastCommand,
  updateLastCommand,
  clearLastCommand,
} = require('./lastCommand');
const ping = require('ping');
const pingUrl = 'www.google.com sdnvkds';

function handleConnectivity() {
  let pingInterval = 10000;
  setInterval(() => {
    ping.sys.probe(pingUrl, async function (isAlive) {
      if (isAlive) {
        await clearLastCommand();
      }
      if (!isAlive) {
        const lastCommand = await checkLastCommand();
        if (!lastCommand) {
          // restart adapter
          await updateLastCommand('adapter-restart');
          restartAdapterLocally();
          return;
        }
        if (lastCommand == 'adapter-restart') {
          // restart system
          await updateLastCommand('system-restart');
          // restartSystemLocally();
          return;
        }
        if (lastCommand == 'system-restart') {
          // do nothing
          return;
        }
      }
    });
  }, pingInterval);
}

ipcRenderer.on('remote-command', (event, arg) => {
  if (arg.command == 'restart-network-adapters') {
    restartAdapterRemotely();
  }

  if (arg.command == 'shutdown-system') {
    shutdownSystemRemotely();
  }

  if (arg.command == 'restart-system') {
    restartSystemRemotely();
  }
});

const updateOnlineStatus = async () => {
  setInterval(async () => {
    ping.sys.probe(pingUrl, async function (isAlive) {
      if (isAlive) {
        document.getElementById('status').innerHTML =
          'Internet Connection Status : Online';
      }
      if (!isAlive) {
        document.getElementById('status').innerHTML =
          'Internet Connection Status : Offline';
      }
    });
  }, 1000);

  var internetLog = navigator.onLine
    ? `Internet Connected at : ${new Date()}`
    : `Internet Disconnected at : ${new Date()}`;

  // await writeSystemLog(internetLog);
  // await updateSystemLog();
  updateSystemInfo();
};

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

updateOnlineStatus();
handleConnectivity();
