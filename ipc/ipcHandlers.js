const { ipcMain } = require('electron');
const { getProjects,addProject } = require('../service/projectsServices');

function registerIpcHandlers() {
    ipcMain.handle('get-projects', () => getProjects());
    ipcMain.handle('add-project', (event, project) => addProject(project));
}

module.exports = { registerIpcHandlers };