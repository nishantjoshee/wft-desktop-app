 const fs = require("fs");

 const filePath = "./log.json";
 function updateSystemLog  (){
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.err('Error reading logs', err);
          return;
        }
    
        try {
    
          const logs = JSON.parse(data);
          const logDataElement = document.getElementById('log-data');
    
          logs.forEach((log, index) => {
            var logContent = log.content;
            if (!document.querySelector(`#log-data li[data-content="${logContent}"]`)) {
    
              var newLi = document.createElement("li");
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

module.exports = {updateSystemLog}