const {app, BrowserWindow, ipcMain} = require("electron");
const axios = require("axios");
const io = require("socket.io-client");

// const Autolaunch = require("auto-launch");


function initSocket() {
  const socket = io("https://ci-uat-bak.naasasecurities.com.np");
  socket.on("connect", () => {
    console.log("Connected");
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
  initSocket();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(); 
      initSocket();
     
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
