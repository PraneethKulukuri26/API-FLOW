const path = require('path');
const fs = require('fs');
const { app } = require('electron');

const isDev = !app.isPackaged;

// Get the shared folder (used in dev)
const getSharedFolder = () => path.join(__dirname, '..', 'shared');

// Get Electron's user data folder (used in prod)
const getUserDataFolder = () => app.getPath('userData');

// Return the folder where project data is stored
const getProdataFolder = () => {
  return isDev
    ? path.join(getSharedFolder(), 'prodata')
    : path.join(getUserDataFolder(), 'prodata');
};

// Return the path to the projects.json file
const getProjectsFile = () => {
  return isDev
    ? path.join(getSharedFolder(), 'projects.json')
    : path.join(getUserDataFolder(), 'projects.json');
};

// Ensure folders and files are created (only in prod)
const ensureUserDataSetup = () => {
  if (isDev) return;

  const userDataPath = getUserDataFolder();
  const projectsFile = getProjectsFile();
  const prodataPath = getProdataFolder();

  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }

  if (!fs.existsSync(projectsFile)) {
    fs.writeFileSync(projectsFile, JSON.stringify({ projects: [] }, null, 2), 'utf-8');
  }

  if (!fs.existsSync(prodataPath)) {
    fs.mkdirSync(prodataPath);
  }
};

// Export everything
module.exports = {
  isDev,
  getSharedFolder,
  getUserDataFolder,
  getProdataFolder,
  getProjectsFile,
  ensureUserDataSetup,
};
