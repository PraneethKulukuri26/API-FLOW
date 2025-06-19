const { ipcMain } = require('electron');
const { getProjects,addProject } = require('../service/projectsServices');
const {getProjectBlueprintTitlesOnlyWithResponses} =require("../service/projectServices");

function registerIpcHandlers() {
    ipcMain.handle('get-projects', () => getProjects());
    ipcMain.handle('add-project', (event, project) => addProject(project));

    //project related hadilar
    ipcMain.handle('get-project-blueprint',(event,id)=>getProjectBlueprintTitlesOnlyWithResponses(id));
}

module.exports = { registerIpcHandlers };