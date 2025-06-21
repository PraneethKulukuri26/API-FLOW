const fs = require('fs');
const path = require('path'); // Import the path module
const { getProjectsFile, getProdataFolder, getProjectFile } = require('../utils/path');

function extractId(input) {
    const [patternStr, rightSide] = input.split("=");

    const folderIds = patternStr.split("_").map(Number);

    let values = [];
    if (rightSide) {
        values = rightSide.split("*").map(Number);
    }

    return { folderIds, resquestId: values[0], responceId: values[1] };
}

const addFolder = ({ id, title, description, folderId }) => {
    const filePath = getProjectFile(id);

    if (!fs.existsSync(filePath)) {
        console.error(`Project file not found for ID: ${id}`);
        return null;
    }

    const projectData = fs.readFileSync(filePath, 'utf-8');
    const project = JSON.parse(projectData);

    let folderSchema = {
        title,
        description,
        createdAt: new Date().toISOString(),
        folderCount: 0,
        requestCount: 0,
        folder: {},
        request: {}
    };

    let newFolderId = "";
    let targetFolder = project;
    let key = "";

    if (!folderId) {
        if (!project.folder) project.folder = {};
        project.folderCount = (project.folderCount || 0) + 1;
        key = `${project.folderCount}`;
        newFolderId = key;
        folderSchema = {
            id: newFolderId,
            ...folderSchema
        };
        project.folder[key] = folderSchema;
    } else {
        const { folderIds } = extractId(folderId);
        for (const id of folderIds) {
            targetFolder = targetFolder.folder?.[id];
            if (!targetFolder) {
                console.error(`Folder path ${folderId} not found.`);
                return null;
            }
        }

        targetFolder.folderCount = (targetFolder.folderCount || 0) + 1;
        key = `${targetFolder.folderCount}`;
        newFolderId = `${folderId}_${key}`;
        folderSchema = {
            id: newFolderId,
            ...folderSchema
        };
        if (!targetFolder.folder) targetFolder.folder = {};
        targetFolder.folder[key] = folderSchema;
    }

    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8');

    return { id: newFolderId, ...folderSchema };
};

const editFolder = ({ id, folderId, title, description }) => {
    const filePath = getProjectFile(id);

    if (!fs.existsSync(filePath)) {
        console.error(`Project file not found for ID: ${id}`);
        return null;
    }

    const projectData = fs.readFileSync(filePath, 'utf-8');
    const project = JSON.parse(projectData);

    let targetFolder = project;

    // Traverse to the specified folder using folderId
    if (folderId) {
        const { folderIds } = extractId(folderId);

        for (const fid of folderIds) {
            if (!targetFolder.folder || !targetFolder.folder[fid]) {
                console.error(`Folder not found: ${folderId}`);
                return null;
            }
            targetFolder = targetFolder.folder[fid];
        }
    } else {
        console.error("folderId is required for editing a folder.");
        return null;
    }

    // Edit title/description
    if (title !== undefined) targetFolder.title = title;
    if (description !== undefined) targetFolder.description = description;
    const updatedAt = new Date().toISOString();
    targetFolder.updatedAt = updatedAt;

    // Save changes
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8');

    return {
        id: folderId,
        title: targetFolder.title,
        description: targetFolder.description,
        updatedAt: new Date().toISOString()
    };
};

const deleteFolder = ({ id, folderId }) => {
    const filePath = getProjectFile(id);

    if (!fs.existsSync(filePath)) {
        console.error(`Project file not found for ID: ${id}`);
        return null;
    }

    const projectData = fs.readFileSync(filePath, 'utf-8');
    const project = JSON.parse(projectData);

    const { folderIds } = extractId(folderId);

    if (!folderIds || folderIds.length === 0) {
        console.error("Invalid folderId provided.");
        return null;
    }

    let parent = project;
    let currentFolder = null;

    for (let i = 0; i < folderIds.length - 1; i++) {
        const fid = folderIds[i];
        if (!parent.folder || !parent.folder[fid]) {
            console.error(`Folder path invalid at level ${fid}`);
            return null;
        }
        parent = parent.folder[fid];
    }

    const targetKey = folderIds[folderIds.length - 1];
    currentFolder = parent.folder?.[targetKey];

    if (!currentFolder) {
        console.error(`Target folder not found: ${folderId}`);
        return null;
    }

    // Delete the folder and update counts
    delete parent.folder[targetKey];
    parent.folderCount = Math.max(0, parent.folderCount - 1);

    // Save changes
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8');

    return { id: folderId, deleted: true };
};

const addRequest = ({ id, folderId, request }) => {
    const filePath = getProjectFile(id);

    // Check if project file exists
    if (!fs.existsSync(filePath)) {
        console.error(`Project file not found for ID: ${id}`);
        return null;
    }

    const projectData = fs.readFileSync(filePath, 'utf-8');
    const project = JSON.parse(projectData);

    let targetFolder = project;
    let requestId = '';

    if (!folderId) {
        console.error("folderId is required to add a request.");
        return null;
    }

    const { folderIds } = extractId(folderId);

    // Traverse to the target folder
    for (const fid of folderIds) {
        if (!targetFolder.folder || !targetFolder.folder[fid]) {
            console.error(`Folder not found for folderId: ${folderId}`);
            return null;
        }
        targetFolder = targetFolder.folder[fid];
    }

    // Ensure the 'request' object exists
    if (!targetFolder.request) {
        targetFolder.request = {};
    }

    // Increment request count and generate request ID
    if (!targetFolder.requestCount) {
        targetFolder.requestCount = 0;
    }
    targetFolder.requestCount += 1;

    requestId = `${folderId}=${targetFolder.requestCount}`;

    // Ensure responsesCount is calculated if responses exist
    if (request.responses) {
        request.responsesCount = Object.keys(request.responses).length;
    } else {
        request.responses = {};
        request.responsesCount = 0;
    }

    // Add timestamps if not provided
    request.createdAt = request.createdAt || new Date().toISOString();
    request.id = requestId;

    targetFolder.request[targetFolder.requestCount] = request;

    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8');

    return request;
};

const editRequest = ({ id, requestId, request }) => {
    const filePath = getProjectFile(id);

    if (!fs.existsSync(filePath)) {
        console.error(`Project file not found for ID: ${id}`);
        return null;
    }

    const projectData = fs.readFileSync(filePath, 'utf-8');
    const project = JSON.parse(projectData);

    // Navigate to target folder
    let targetFolder = project;
    const { folderIds, resquestId } = extractId(requestId);

    for (const fid of folderIds) {
        if (!targetFolder.folder || !targetFolder.folder[fid]) {
            console.error(`Folder not found for folderId: ${fid}`);
            return null;
        }
        targetFolder = targetFolder.folder[fid];
    }

    //const { resquestId } = extractId(requestId); // Typo preserved from user code

    if (!targetFolder.request || !targetFolder.request[resquestId]) {
        console.error(`Request not found with ID: ${requestId}`);
        return null;
    }

    const existingRequest = targetFolder.request[resquestId];

    // Merge existing request with updated fields
    const updatedRequest = {
        ...existingRequest,
        ...request,
        id: requestId,
        createdAt: existingRequest.createdAt, //|| new Date().toISOString()
        updatedAt: new Date().toISOString,
    };

    // Update responsesCount if responses were passed
    if (request.responses) {
        updatedRequest.responsesCount = Object.keys(request.responses).length;
    }

    // Save updated request
    targetFolder.request[resquestId] = updatedRequest;

    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8');

    return updatedRequest;
};

const deleteRequest = ({ id, requestId }) => {
    const filePath = getProjectFile(id);

    if (!fs.existsSync(filePath)) {
        console.error(`Project file not found for ID: ${id}`);
        return null;
    }

    const projectData = fs.readFileSync(filePath, 'utf-8');
    const project = JSON.parse(projectData);

    // Extract folder path and request index
    const { folderIds, resquestId } = extractId(requestId); // 'resquestId' preserved from earlier code

    let currentFolder = project;
    for (const fid of folderIds) {
        if (!currentFolder.folder || !currentFolder.folder[fid]) {
            console.error(`Invalid folder path in requestId: ${requestId}`);
            return null;
        }
        currentFolder = currentFolder.folder[fid];
    }

    if (!currentFolder.request || !currentFolder.request[resquestId]) {
        console.error(`Request not found: ${requestId}`);
        return null;
    }

    // Delete the request
    delete currentFolder.request[resquestId];

    // Update request count
    currentFolder.requestCount = Object.keys(currentFolder.request).length;

    // Save changes to file
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8');

    return { id: requestId, deleted: true };
};

const addResponse = ({ id, requestId, response }) => {
    const filePath = getProjectFile(id);

    if (!fs.existsSync(filePath)) {
        console.error(`Project file not found for ID: ${id}`);
        return null;
    }

    const projectData = fs.readFileSync(filePath, 'utf-8');
    const project = JSON.parse(projectData);

    // Extract folder path and request index
    const { folderIds, resquestId } = extractId(requestId); // 'resquestId' from your utility

    let currentFolder = project;
    for (const fid of folderIds) {
        if (!currentFolder.folder || !currentFolder.folder[fid]) {
            console.error(`Invalid folder path in requestId: ${requestId}`);
            return null;
        }
        currentFolder = currentFolder.folder[fid];
    }

    const requestObj = currentFolder.request?.[resquestId];
    if (!requestObj) {
        console.error(`Request not found: ${requestId}`);
        return null;
    }

    // Initialize responses object if not present
    if (!requestObj.responses) {
        requestObj.responses = {};
    }

    // Generate a new response ID (1-based key)
    const newResponseKey = Object.keys(requestObj.responses).length + 1;

    // Assign an internal response ID (if needed for future reference)
    const fullResponseId = `${requestId}*${newResponseKey}`;
    const newResponse = {
        id: fullResponseId,
        ...response
    };

    // Add the new response
    requestObj.responses[newResponseKey] = newResponse;

    // Update the responsesCount
    requestObj.responsesCount = Object.keys(requestObj.responses).length;

    // Save updated project to file
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8');

    return { id: fullResponseId, ...newResponse };
};

const editResponse = ({ id, responseId, response }) => {
    const filePath = getProjectFile(id);

    if (!fs.existsSync(filePath)) {
        console.error(`Project file not found for ID: ${id}`);
        return null;
    }

    const projectData = fs.readFileSync(filePath, 'utf-8');
    const project = JSON.parse(projectData);

    // Extract folder path and response index
    const { folderIds, resquestId, responceId } = extractId(responseId);

    let currentFolder = project;
    for (const fid of folderIds) {
        if (!currentFolder.folder || !currentFolder.folder[fid]) {
            console.error(`Invalid folder path in responseId: ${responseId}`);
            return null;
        }
        currentFolder = currentFolder.folder[fid];
    }

    const requestObj = currentFolder.request?.[resquestId];
    if (!requestObj) {
        console.error(`Request not found: ${resquestId}`);
        return null;
    }

    const existingResponse = requestObj.responses?.[responceId];
    if (!existingResponse) {
        console.error(`Response not found: ${responseId}`);
        return null;
    }

    // Update only provided fields
    const updatedResponse = {
        ...existingResponse,
        ...response,
        id: responseId // Ensure the response ID stays consistent
    };

    requestObj.responses[responceId] = updatedResponse;

    // Save updated project to file
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8');

    return updatedResponse;
};

const deleteResponse = ({ id, responseId }) => {
    const filePath = getProjectFile(id);

    if (!fs.existsSync(filePath)) {
        console.error(`Project file not found for ID: ${id}`);
        return null;
    }

    const projectData = fs.readFileSync(filePath, 'utf-8');
    const project = JSON.parse(projectData);

    // Extract folder path and response index
    const { folderIds, resquestId, responceId } = extractId(responseId);

    let currentFolder = project;

    for (const fid of folderIds) {
        if (!currentFolder.folder || !currentFolder.folder[fid]) {
            console.error(`Invalid folder path in responseId: ${responseId}`);
            return null;
        }
        currentFolder = currentFolder.folder[fid];
    }

    const requestObj = currentFolder.request?.[resquestId];
    if (!requestObj || !requestObj.responses || !requestObj.responses[responceId]) {
        console.error(`Response not found for ID: ${responseId}`);
        return null;
    }

    // Delete the response
    delete requestObj.responses[responceId];

    // Optionally update a responsesCount field if you have one
    if (requestObj.responsesCount && requestObj.responsesCount > 0) {
        requestObj.responsesCount--;
    }

    // Save updated project to file
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8');

    return { id: responseId, deleted: true };
};

const getProjectBlueprintTitlesOnlyWithResponses = (id) => {

    try {
        const filePath = getProjectFile(id);

        if (!fs.existsSync(filePath)) {
            console.error(`Project file not found for ID: ${id}`);
            return null;
        }

        const projectData = fs.readFileSync(filePath, 'utf-8');
        const project = JSON.parse(projectData);

        const parseFolder = (folder, folderId = '') => {
            const folders = folder.folder || {};
            const requests = folder.request || {};

            return {
                id: folderId || folder.id || '',
                title: folder.title || '',
                folders: Object.entries(folders).map(([key, subFolder]) => {
                    const nextId = folderId ? `${folderId}_${key}` : key;
                    return parseFolder(subFolder, nextId);
                }),
                requests: Object.entries(requests).map(([reqKey, req]) => {
                    const fullRequestId = folderId ? `${folderId}=${reqKey}` : `${reqKey}`;
                    const responses = req.responses || {};
                    return {
                        id: fullRequestId,
                        title: req.title || '',
                        responses: Object.entries(responses).map(([resKey, res]) => ({
                            id: `${fullRequestId}*${resKey}`,
                            title: res.title || '',
                        })),
                    };
                }),
            };
        };

        const topFolders = project.folder || {};

        return Object.entries(topFolders).map(([key, folder]) =>
            parseFolder(folder, key)
        );
    } catch (err) {
        console.log(err);
        return null;
    }
};

module.exports = { addFolder, editFolder, deleteFolder, addRequest, editRequest, deleteRequest, addResponse, editResponse, deleteResponse, getProjectBlueprintTitlesOnlyWithResponses };