import { Request, Response } from "./projectType"

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

export interface EditRequestResponce extends Request {

}

export interface EditResponceRes extends Response {

}