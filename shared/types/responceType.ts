import { Request, Response,Folder } from "./projectType"

export interface DeleteResponce {
    id: string,
    deleted: boolean
}

export interface EditFolderResponce {
    id: string,
    title: string,
    description: string,
    updatedAt: string
}

//todo:check
export interface EditRequestResponce extends Request {

}

//todo:check
export interface EditResponceRes extends Response {

}

export interface RequestResponse {
    success: boolean;
    status?: number;
    statusText?: string;
    responseTime?: number;
    responseSize?: number;
    responseSizeHuman?: string;
    responseType?: string;
    headers?: Record<string, string>;
    data?: any;
    message?: string;
}

export interface GetFolderRes extends Folder{

}
  
export interface GetRequestRes extends Request{

}

export interface GetResponceRes extends RequestResponse{
    id:string,
    title:string,
}