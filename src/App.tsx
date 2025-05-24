// src/App.tsx
import React, { useState } from 'react';
import ProjectSelector from './components/ProjectSelector';
import Sidebar from './components/Sidebar';
import ApiWorkspace from './components/ApiWorkspace';

function App() {
  const [project, setProject] = useState<{ name: string } | null>(null);

  if (!project) {
    return <ProjectSelector onProjectCreated={setProject} />;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* <header className="bg-gray-800 text-white p-2 flex items-center">
        <div className="mr-4">API Network</div>
        <div className="flex-1 relative">
          <input 
            type="text" 
            className="w-full px-3 py-1 bg-gray-700 rounded text-white"
            placeholder="Search Postman"
          />
        </div>
        <div className="ml-4 flex items-center space-x-3">
          <button className="bg-blue-600 px-3 py-1 rounded">Invite</button>
          <button>Upgrade</button>
        </div>
      </header> */}
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64">
          <Sidebar projectName={project.name} />
        </div>
        <div className="flex-1">
          <ApiWorkspace projectName={project.name} />
        </div>
      </div>
    </div>
  );
}

export default App;
