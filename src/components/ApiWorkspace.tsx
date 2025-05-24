import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ApiWorkspaceProps {
    projectName?: string;
}

interface ParamItem {
    key: string;
    value: string;
    description: string;
}

const ApiWorkspace: React.FC<ApiWorkspaceProps> = ({ projectName = "API Test Project" }) => {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('https://api.example.com/users');
    const [activeTab, setActiveTab] = useState('Body');
    const [bodyType, setBodyType] = useState('json');
    const [jsonBody, setJsonBody] = useState('{\n  "name": "John Doe",\n  "email": "john@example.com"\n}');
    const [responseStatus, setResponseStatus] = useState('');
    const [responseData, setResponseData] = useState('');
    const [params, setParams] = useState<ParamItem[]>([{ key: '', value: '', description: '' }]);
    const [responseHeight, setResponseHeight] = useState(300);
    const [isResizing, setIsResizing] = useState(false);
    const [startY, setStartY] = useState(0);
    const [startHeight, setStartHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const resizeHandleRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        // Mock response simulation
        setResponseStatus('200 OK');
        setResponseData(`{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "status": "active",
  "profile": {
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Software developer with passion for API design",
    "location": "San Francisco, CA"
  },
  "permissions": ["read", "write", "admin"],
  "last_login": "2024-01-20T15:45:00Z",
  "profile": {
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Software developer with passion for API design",
    "location": "San Francisco, CA"
  },
  "permissions": ["read", "write", "admin"],
  "last_login": "2024-01-20T15:45:00Z"
}`);
    };

    const handleAddParam = () => {
        setParams([...params, { key: '', value: '', description: '' }]);
    };

    const handleParamChange = (index: number, field: keyof ParamItem, value: string) => {
        const updatedParams = [...params];
        updatedParams[index][field] = value;
        setParams(updatedParams);
    };

    const handleRemoveParam = (index: number) => {
        if (params.length > 1) {
            const updatedParams = params.filter((_, i) => i !== index);
            setParams(updatedParams);
        }
    };

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        setStartY(e.clientY);
        setStartHeight(responseHeight);
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
    }, [responseHeight]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing) return;
        const containerHeight = containerRef.current?.clientHeight || 0;
        const maxHeight = containerHeight * 0.8;
        const deltaY = startY - e.clientY;
        const newHeight = Math.max(100, Math.min(maxHeight, startHeight + deltaY));
        setResponseHeight(newHeight);
    }, [isResizing, startY, startHeight]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }, []);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isResizing, handleMouseMove, handleMouseUp]);

    const beautifyJSON = () => {
        try {
            const parsed = JSON.parse(jsonBody);
            setJsonBody(JSON.stringify(parsed, null, 2));
        } catch (error) {
            console.warn('Invalid JSON format');
        }
    };

    return (
        <div ref={containerRef} className="flex flex-col h-screen bg-white">
            <div className="flex items-center p-3 border-b bg-gray-50">
                <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        New
                    </button>
                </div>
                <div className="ml-auto">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Save
                    </button>
                </div>
            </div>

            <div className="flex items-center p-3 border-b bg-white">
                <select
                    className="px-3 py-2 bg-gray-100 border rounded-md mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                    <option>PATCH</option>
                </select>
                <input
                    type="text"
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter request URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    className="ml-3 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>

            <div className="flex border-b bg-gray-50">
                {['Params', 'Headers', 'Body'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-6 py-3 font-medium transition-colors ${
                            activeTab === tab 
                                ? 'border-b-2 border-blue-600 text-blue-600 bg-white' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto">
                {activeTab === 'Params' && (
                    <div className="p-4">
                        <div className="space-y-3">
                            {params.map((param, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Key"
                                        value={param.key}
                                        onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Value"
                                        value={param.value}
                                        onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Description"
                                        value={param.description}
                                        onChange={(e) => handleParamChange(index, 'description', e.target.value)}
                                    />
                                    <button
                                        className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        onClick={() => handleRemoveParam(index)}
                                        disabled={params.length === 1}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                className="mt-4 px-4 py-2 bg-gray-100 border rounded-md text-sm hover:bg-gray-200 transition-colors"
                                onClick={handleAddParam}
                            >
                                + Add Parameter
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Headers' && (
                    <div className="p-4">
                        <div className="text-gray-500 text-center py-8">
                            Headers configuration coming soon...
                        </div>
                    </div>
                )}

                {activeTab === 'Body' && (
                    <div className="p-4">
                        <div className="flex space-x-6 mb-4">
                            {[
                                { value: 'none', label: 'None' },
                                { value: 'form-data', label: 'Form Data' },
                                { value: 'json', label: 'JSON' }
                            ].map((option) => (
                                <label key={option.value} className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="bodyType"
                                        value={option.value}
                                        checked={bodyType === option.value}
                                        onChange={() => setBodyType(option.value)}
                                        className="mr-2 text-blue-600"
                                    />
                                    <span className="text-sm font-medium">{option.label}</span>
                                </label>
                            ))}
                        </div>

                        {bodyType === 'json' && (
                            <div className="border rounded-lg overflow-hidden">
                                <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
                                    <span className="font-medium text-gray-700">JSON</span>
                                    <button 
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                        onClick={beautifyJSON}
                                    >
                                        Beautify
                                    </button>
                                </div>
                                <textarea
                                    className="w-full h-400 p-4 font-mono text-sm resize-none focus:outline-none"
                                    style={{ whiteSpace: 'pre-wrap' ,height: `${responseHeight}px`}}
                                    value={jsonBody}
                                    onChange={(e) => setJsonBody(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Resizable Response Panel */}
            <div
                ref={resizeHandleRef}
                onMouseDown={handleMouseDown}
                className="h-2 cursor-row-resize bg-gray-200"
            />
            <div
                className="bg-gray-50 border-t p-4 overflow-auto font-mono text-sm"
                style={{ height: `${responseHeight}px` }}
            >
                <div className="mb-2 text-sm text-gray-600">Status: {responseStatus}</div>
                <pre className="whitespace-pre-wrap">{responseData}</pre>
            </div>
        </div>
    );
};

export default ApiWorkspace;
