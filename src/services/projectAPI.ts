import { Project, ProjectCurrentOrAllResponse, Folder, Request, Response } from "../../shared/types/projectType";
import {
    AddFolderReq,
    AddRequestReq,
    AddResponce,
    DeleteFolderReq,
    DeleteRequestReq,
    DeleteResponceReq,
    EditFolderReq,
    EditRequestReq,
    EditResponseReq,
    RequestReq
} from "../../shared/types/requestType";

import {
    DeleteResponce,
    EditFolderResponce,
    EditRequestResponce,
    EditResponceRes,
    RequestResponse
} from "../../shared/types/responceType";

export const getProjects = async (): Promise<Project[]> => {
    return await (window as any).electron.ipcRenderer.invoke('get-projects');
};

export const addProject = async (project: Project): Promise<Project> => {
    return await (window as any).electron.ipcRenderer.invoke('add-project', project);
};

export const getProjectCurrentOrAll = async (): Promise<ProjectCurrentOrAllResponse> => {
    return await (window as any).electron.ipcRenderer.invoke('get-project-current-or-all');
};

export const addFolder = async (addFold: AddFolderReq): Promise<Folder> => {
    return await (window as any).electron.ipcRenderer.invoke('add-folder', addFold);
}

export const addRequest = async (request: AddRequestReq): Promise<Request> => {
    return await (window as any).electron.ipcRenderer.invoke('add-request', request);
}

export const addResponce = async (req: AddResponce): Promise<Response> => {
    return await (window as any).electron.ipcRenderer.invoke('add-response', req);
}

export const deleteFolder = async (req: DeleteFolderReq): Promise<DeleteResponce> => {
    return await (window as any).electron.ipcRenderer.invoke('delete-foilder', req);
}

export const deleteRequest = async (req: DeleteRequestReq): Promise<DeleteResponce> => {
    return await (window as any).electron.ipcRenderer.invoke('delete-request', req);
}

export const deleteResponce = async (req: DeleteResponceReq): Promise<DeleteResponce> => {
    return await (window as any).electron.ipcRenderer.invoke('delete-responce', req);
}

export const editFolder = async (req: EditFolderReq): Promise<EditFolderResponce> => {
    return await (window as any).electron.ipcRenderer.invoke('edit-folder', req);
}

export const editRequest = async (req: EditRequestReq): Promise<EditRequestResponce> => {
    return await (window as any).electron.ipcRenderer.invoke('edit-request', req);
}

export const editResponce = async (req: EditResponseReq): Promise<EditResponceRes> => {
    return await (window as any).electron.ipcRenderer.invoke('edit-responce', req);
}

//requist related
export const sendRequest=async(req:RequestReq):Promise<RequestResponse>=>{
    return await (window as any).electron.ipcRenderer.invoke('send-request',req);
}