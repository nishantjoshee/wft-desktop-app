const { app, BrowserWindow, ipcMain } = require("electron");
const axios = require("axios");
const io = require("socket.io-client");
const fs = require("fs");

// const Autolaunch = require("auto-launch");


function initSocket(window) {
  const socket = io("https://ci-uat-bak.naasasecurities.com.np",
    {
      transportOptions: {
        polling: {
          extraHeaders: {
            "Authorization": "remote-command"
          }
        }
      }
    });
  socket.on("remote-command", (payload) => {
    window.webContents.send("remote-command", payload);
    // console.log("remote command execution");
  });

  socket.on("connect", () => {
    window.webContents.send("remote-connection-status", "Connected");
  });

  socket.on("disconnect", () => {
    window.webContents.send("remote-connection-status", "Not Connected");
  })
}


// let autoLauncher = new Autolaunch({
//   name: "wft-desktop-app"
// });

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false
  });

  win.loadFile('index.html');
  
  initSocket(win);
  // win.webContents.openDevTools();
  fs.readFile("./log.json", 'utf8', (err, data) => {
    if(err) {
      console.error("Error");
      return;
    }
    const logs = JSON.parse(data);
    const newObject = {
      content : `Application Started at : ${new Date()}`
    }
    logs.unshift(newObject);
    const updatedJson = JSON.stringify(logs, null, 2);
    fs.writeFile("./log.json", updatedJson, 'utf8', (err) => {
      if (err) {
        console.error("An error occurred while writing the log:", err);
        return;
      }
    })

  })

  setInterval(() => {
    axios.get('https://us-central1-wft-desktop-app.cloudfunctions.net/api/update-status')
      .then(response => {
        console.log('API Response:', response.data);
      })
      .catch(error => {
        console.error('API Error:', error);
      });
  }, 500000);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(); 

    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
