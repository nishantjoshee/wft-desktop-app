const fs = require('fs').promises;

const filePath = './log.json';
async function updateSystemLog() {
  // console.log('update called');
  await fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.err('Error reading logs', err);
      return;
    }
    const logs = JSON.parse(data);
    const logDataElement = document.getElementById('log-data');
    logs.forEach((log, index) => {
      var logContent = log.content;
      if (
        !document.querySelector(`#log-data li[data-content="${logContent}"]`)
      ) {
        var newLi = document.createElement('li');
        newLi.textContent = logContent;
        newLi.setAttribute('data-content', logContent);
        logDataElement.appendChild(newLi);
      }
    });
  });
}

async function getPreviousLog() {
  try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
  } catch (err) {
      console.error('Error reading logs', err);
      throw err; 
  }
}
async function writeSystemLog(content) {
  const newEntry = {
    content: content,
  };
  var prevLogs = await getPreviousLog();
  console.log(prevLogs);
  prevLogs.unshift(newEntry);
  const updatedLogData = JSON.stringify(prevLogs, null, 2);
  await fs.writeFile(filePath, updatedLogData, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred while writing the log:', err);
      return;
    }
    console.log('Successfully added log');
  });
}

module.exports = { updateSystemLog, writeSystemLog };
