const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Load config
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'config.json'), 'utf-8'));

let mainWindow;
let splash;

function createWindows() {
  // Create splash window
  splash = new BrowserWindow({
    width: config.splashWindow.width,
    height: config.splashWindow.height,
    transparent: false,
    frame: false,
    alwaysOnTop: true,
  });

  splash.loadFile('splash.html');

  // Create main window but keep hidden
  mainWindow = new BrowserWindow({
    width: config.mainWindow.width,
    height: config.mainWindow.height,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(config.reactDevURL);

  mainWindow.webContents.once('did-finish-load', () => {
    setTimeout(() => {
      splash.close();
      mainWindow.show();
    }, config.splashWindow.delay);
  });
}

app.whenReady().then(createWindows);
