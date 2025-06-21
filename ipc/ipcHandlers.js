const { ipcMain } = require('electron');
const { getProjects, addProject, getCurrentProjectOrAll } = require('../service/projectsServices');
const {
    getProjectBlueprintTitlesOnlyWithResponses,
    addFolder,
    addRequest,
    addResponse,
    deleteFolder,
    deleteRequest,
    deleteResponse,
    editFolder,
    editRequest,
    editResponse,
} = require("../service/projectServices");

function registerIpcHandlers() {
    ipcMain.handle('get-projects', () => getProjects());
    ipcMain.handle('add-project', (event, project) => addProject(project));
    ipcMain.handle('get-project-current-or-all', (event, _) => getCurrentProjectOrAll());

    //project related hadilar
    ipcMain.handle('get-project-blueprint', (event, id) => getProjectBlueprintTitlesOnlyWithResponses(id));
    ipcMain.handle('add-folder', (event, ele) => addFolder(ele));
    ipcMain.handle('add-request', (event, ele) => addRequest(ele));
    ipcMain.handle('add-response', (event, ele) => addResponse(ele));
    ipcMain.handle('delete-foilder', (event, ele) => deleteFolder(ele));
    ipcMain.handle('delete-request', (event, ele) => deleteRequest(ele));
    ipcMain.handle('delete-responce', (event, ele) => deleteResponse(ele));
    ipcMain.handle('edit-folder', (event, ele) => editFolder(ele));
    ipcMain.handle('edit-request', (event, ele) => editRequest(ele));
    ipcMain.handle('edit-responce', (event, ele) => editResponse(ele));

}

module.exports = { registerIpcHandlers };