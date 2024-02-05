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

function restartAdapterLocally() {
  executePowershell('Get-NetAdapter | Restart-NetAdapter -Confirm:$false')
    .then(async (output) => {
      const successLog = `Local network adapter restart success at : ${new Date()}`;
      await writeSystemLog(successLog);
      await updateSystemLog();
      console.log('Command output', output);
    })
    .catch(async (error) => {
      const errorLog = `Local network adapter restart error at : ${new Date()}`;
      await writeSystemLog(errorLog);
      await updateSystemLog();
      console.error('Error executing command', error);
    });
}

function restartAdapterRemotely() {
  executePowershell('Get-NetAdapter | Restart-NetAdapter -Confirm:$false')
    .then(async (output) => {
      const successLog = `Remote network adapter restart success at : ${new Date()}`;
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

function restartSystemRemotely() {
  return executePowershell('Restart-Computer')
    .then(async (output) => {
      const successLog = `Remote system restart success at : ${new Date()}`;
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

function restartSystemLocally() {
  return executePowershell('Restart-Computer')
    .then(async (output) => {
      const successLog = `Local system restart success at : ${new Date()}`;
      await writeSystemLog(successLog);
      await updateSystemLog();
      console.log('Command output', output);
    })
    .catch(async (error) => {
      const errorLog = `Local system restart error at : ${new Date()}`;
      await writeSystemLog(errorLog);
      await updateSystemLog();
      console.error('Error executing command', error);
    });
}

function shutdownSystemRemotely() {
  return executePowershell('Stop-Computer -ComputerName localhost')
    .then(async (output) => {
      const successLog = `Remote system shutdown success at : ${new Date()}`;
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

function shutdownSystemLocally() {
  return executePowershell('Stop-Computer -ComputerName localhost')
    .then(async (output) => {
      const successLog = `Local system shutdown success at : ${new Date()}`;
      await writeSystemLog(successLog);
      await updateSystemLog();
      console.log('Command output', output);
    })
    .catch(async (error) => {
      const errorLog = `Local system shudown error at : ${new Date()}`;
      await writeSystemLog(errorLog);
      await updateSystemLog();
      console.error('Error executing command', error);
    });
}

module.exports = {
  shutdownSystemLocally,
  shutdownSystemRemotely,
  restartSystemLocally,
  restartSystemRemotely,
  restartAdapterLocally,
  restartAdapterRemotely,
};
