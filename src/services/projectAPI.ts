import { Project } from "../../shared/types/projectType";

export const getProjects = async (): Promise<Project[]> => {
    return await (window as any).electron.ipcRenderer.invoke('get-projects');
};