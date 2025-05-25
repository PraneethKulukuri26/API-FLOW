import { Project } from "../../shared/types/projectType";

export const getProjects = async (): Promise<Project[]> => {
    return await (window as any).electron.ipcRenderer.invoke('get-projects');
};

export const addProject = async (project: Project): Promise<Project> => {
    return await (window as any).electron.ipcRenderer.invoke('add-project', project);
};