const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { ensureUserDataSetup } = require('./utils/path'); // ✅ Import your setup
const { registerIpcHandlers } = require('./ipc/ipcHandlers');

// Load config
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'config.json'), 'utf-8'));

let mainWindow;
let splash;

// 👇 Check if we're in development or production
const isDev = !app.isPackaged;

function createWindows() {
  // Splash Window
  splash = new BrowserWindow({
    width: config.splashWindow.width,
    height: config.splashWindow.height,
    transparent: false,
    frame: false,
    alwaysOnTop: true,
  });

  splash.loadFile('splash.html');

  // Main Window
  mainWindow = new BrowserWindow({
    width: config.mainWindow.width,
    height: config.mainWindow.height,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  // 👇 Load React app differently based on mode
  if (isDev) {
    mainWindow.loadURL(config.reactDevURL); // usually http://localhost:3000
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html')); // from build folder
  }

  mainWindow.webContents.once('did-finish-load', () => {
    setTimeout(() => {
      splash.close();
      mainWindow.show();
    }, config.splashWindow.delay);
  });
}

app.whenReady().then(() => {
  ensureUserDataSetup(); // ✅ Ensure folders/files exist first
  registerIpcHandlers(); // ⏩ Then register IPC handlers
  createWindows();       // ⏩ Then create windows
});
