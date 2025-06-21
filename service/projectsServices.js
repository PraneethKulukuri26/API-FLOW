const fs = require('fs');
const path = require('path'); // Import the path module
const { getProjectsFile, getProdataFolder } = require('../utils/path');

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
    // Get the file path where project data is stored
    const projectsFile = getProjectsFile();

    // If the file doesn't exist, return null (no project data available)
    if (!fs.existsSync(projectsFile)) {
        return null;
    }

    // Read the contents of the projects file and parse the JSON data
    const projectsData = fs.readFileSync(projectsFile, 'utf-8');
    const data = JSON.parse(projectsData);

    // If no currentProjectId is set, but projects exist
    if (!data.currentProjectId && data.projects && data.projects.length > 0) {
        // Return all projects with a flag indicating there's no current project selected
        return { currentProject: false, data: data.projects };
    }

    // If a currentProjectId is set and projects exist
    if (data.projects && data.projects.length > 0) {
        // Try to find the project that matches the currentProjectId
        const currentProject = data.projects.find(project => project.id === data.currentProjectId);

        // Return the matched project, or fallback to the first project in the list
        return { currentProject: true, data: currentProject || data.projects[0] };
    }

    // Return null if no projects are available
    return null;
}

const addProject = (project) => {
    const projectsFile = getProjectsFile();
    // Ensure the projects file exists before reading
    if (!fs.existsSync(projectsFile)) {
        // If it doesn't exist, create it with an empty projects array
        fs.writeFileSync(projectsFile, JSON.stringify({ projects: [] }, null, 2), 'utf-8');
    }

    const projectsData = fs.readFileSync(projectsFile, 'utf-8');
    const data = JSON.parse(projectsData);
    if (!data.projects) {
        data.projects = [];
    }

    const id = Date.now(); // Generate ID

    // Assign generated ID and dates to the project object
    project.created = new Date().toISOString(); // Use ISO string for consistent date format
    project.updated = new Date().toISOString(); // Use ISO string for consistent date format
    project.id = id.toString(); // Ensure ID is a string if needed elsewhere

    data.projects.push(project); // Add project to the list

    // Write the updated projects list back to the file
    fs.writeFileSync(projectsFile, JSON.stringify(data, null, 2), 'utf-8');

    // --- New code to create [project_id].json ---
    const projectDataFolder = getProdataFolder(); // Get the specific project's data folder
    // Construct the path for the file using the project ID as the filename
    const idFilePath = path.join(projectDataFolder, `${id}.json`);

    // Ensure the project data folder exists
    // if (!fs.existsSync(projectDataFolder)) {
    //     fs.mkdirSync(projectDataFolder, { recursive: true }); // Create folder recursively if it doesn't exist
    // }

    // Write the project ID to the [project_id].json file
    fs.writeFileSync(idFilePath, JSON.stringify({ id: project.id, title: project.title, description: project.description, folderCount: 0, folders: {} }, null, 2), 'utf-8');
    // --- End new code ---

    return project; // Return the added project object
}

module.exports = { getProjects, getCurrentProject, getCurrentProjectOrAll, addProject };