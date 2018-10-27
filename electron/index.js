'use strict';
var electron = require('electron');
var app = electron.app;
var browserWindow = electron.BrowserWindow;

let mainWindow;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new browserWindow({
    window: 800,
    height: 600,
    'node-integration': false
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
//   mainWindow.loadURL('http://localhost:3000')
  mainWindow.on('closed', function() {
    electron.session.defaultSession.clearCache(() => {})
    mainWindow = null;
  });
});
