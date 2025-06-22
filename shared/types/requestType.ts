import { Request, Response } from './projectType';

export interface AddFolderReq {
    id: string,
    title?: string,
    description?: string,
    folderId?: string
}

export interface AddRequestReq {
    id: string,
    folderId: string,
    request: Request
}

export interface AddResponce {
    id: string,
    requestId: string,
    response: Response
}

export interface DeleteFolderReq {
    id: string,
    folderId: string
}

export interface DeleteRequestReq {
    id: string,
    requestId: string,
}

export interface DeleteResponceReq {
    id: string,
    responseId: string
}

export interface EditFolderReq {
    id: string,
    folderId: string,
    description?: string,
    title?: string
}

export interface EditRequestReq {
    id: string,
    requestId: string,
    request: Request
}

//todo:check
export interface EditResponseReq {
    id: string,
    responseId: string,
    response: Response
}

export interface RequestReq {
    method?: string;
    url: string;
    headers?: Record<string, string>;
    queryParams?: Record<string, string | number | boolean>;
    bodyType?: 'json' | 'form-data' | 'x-www-form-urlencoded';
    body?: Record<string, any> | FormData;
}

export interface GetFolderReq extends DeleteFolderReq{

}
  
export interface GetRequestReq extends DeleteRequestReq{

}

export interface GetResponceReq extends DeleteResponceReq{
    
}