const fs = require('fs');

const filePath = './log.json';
function updateSystemLog(tracking) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.err('Error reading logs', err);
      return;
    }
    if (tracking) {
      console.log('tracking');
    }

    try {
      const logs = JSON.parse(data);
      const newObject = {
        content: navigator.onLine
          ? `Internet Connected at ${new Date()}`
          : `Internet Disconnected at ${new Date()}`,
      };
      logs.unshift(newObject);
      const updatedJson = JSON.stringify(logs, null, 2);
      fs.writeFile(filePath, updatedJson, 'utf8', (err) => {
        if (err) {
          console.error('An error occurred while writing the log:', err);
          return;
        }

        console.log('Successfully added log.');
      });

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
    } catch (err) {
      console.error('Error parsing logs', err);
    }
  });
}

module.exports = { updateSystemLog };
