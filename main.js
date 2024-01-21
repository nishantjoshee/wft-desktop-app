const { app, BrowserWindow } = require('electron');
const path = require('path');
const axios = require('axios');
const Autolaunch = require("auto-launch");

let autoLauncher = new Autolaunch({
  name : "wft-desktop-app"
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
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
  }, 5000);
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
