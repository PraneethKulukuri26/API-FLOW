const fs = require('fs');
const {getProjectsFile} = require('../utils/path');

const getProjects = () => {
    const projectsFile = getProjectsFile();

    const projectsData = fs.readFileSync(projectsFile, 'utf-8');
    const projects = JSON.parse(projectsData).projects;
    return projects;
}

const getCurrentProject = () => {
    const projectsFile = getProjectsFile();
    
    if (!fs.existsSync(projectsFile)) {
        return null;
    }
    
    const projectsData = fs.readFileSync(projectsFile, 'utf-8');
    const data = JSON.parse(projectsData);
    
    // If no currentProjectId is set or it's empty
    if (!data.currentProjectId && data.projects && data.projects.length > 0) {
        return null; // Return first project as default
    }
    
    // Find the project with the matching ID
    if (data.projects && data.projects.length > 0) {
        const currentProject = data.projects.find(project => project.id === data.currentProjectId);
        return currentProject || data.projects[0]; // Return found project or first as fallback
    }
    
    return null; // No projects exist
}

const getCurrentProjectOrAll = () => {
    const projectsFile = getProjectsFile();
    
    if (!fs.existsSync(projectsFile)) {
        return null;
    }
    
    const projectsData = fs.readFileSync(projectsFile, 'utf-8');
    const data = JSON.parse(projectsData);
    
    // If no currentProjectId is set or it's empty
    if (!data.currentProjectId && data.projects && data.projects.length > 0) {
        return data.projects; // Return first project as default
    }
    
    // Find the project with the matching ID
    if (data.projects && data.projects.length > 0) {
        const currentProject = data.projects.find(project => project.id === data.currentProjectId);
        return currentProject || data.projects[0]; // Return found project or first as fallback
    }
    
    return null; // No projects exist
}

module.exports = { getProjects, getCurrentProject ,getCurrentProjectOrAll};