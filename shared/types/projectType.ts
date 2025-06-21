import {RequestResponse} from "./responceType";

export interface Project {
  id?: string;
  title?: string;
  description?: string;
  created?: string;
  updated?: string;
}

// Response when multiple projects are returned
export interface ProjectListResponse {
  currentProject: false;
  data: Project[];
}

// Response when a single current project is returned
export interface CurrentProjectResponse {
  currentProject: true;
  data: Project;
}

// Union of both response types
export type ProjectCurrentOrAllResponse = ProjectListResponse | CurrentProjectResponse;

export interface KeyValueObject {
  key: string,
  value: string,
  description?: string
}

export interface formDataObject extends KeyValueObject {
  type: string
}

export interface BodyObject {
  type: string,
  raw?: string,
  formData?: Array<formDataObject>,
  x_www_form_urlencoded?: Array<KeyValueObject>
}

export interface Request {
  id?: string,
  title?: string,
  description?: string,
  createdAt?: string,
  updatedAt?:string,
  method?: string,
  url?: string,
  headers?: Array<KeyValueObject>,
  params?: Array<KeyValueObject>,
  body?: BodyObject,
}

export interface Folder {
  id?: string,
  title?: string,
  description?: string,
  createdAt?: string,
  updatedAt?:string
}

export interface Response {
  id?: string,
  title?: string,
  body:RequestResponse
}