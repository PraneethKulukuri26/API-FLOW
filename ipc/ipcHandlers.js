const { ipcMain } = require('electron');
const { getProjects } = require('../service/projectsServices');

function registerIpcHandlers() {
    ipcMain.handle('get-projects', () => getProjects());
}

module.exports = { registerIpcHandlers };