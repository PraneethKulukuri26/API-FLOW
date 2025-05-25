// src/components/ProjectSelector.tsx
import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/projectAPI';

interface Props {
  onProjectCreated: (project: { name: string }) => void;
}

const ProjectSelector: React.FC<Props> = ({ onProjectCreated }) => {
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    // Fetch projects and log them to console
    const fetchProjects = async () => {
      try {
        const projects = await getProjects();
        console.log('Projects:', projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleCreate = () => {
    if (projectName.trim()) {
      onProjectCreated({ name: projectName });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl mb-4">Create New API Project</h1>
      <input
        className="px-4 py-2 rounded text-black mb-4"
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <button
        onClick={handleCreate}
        className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
      >
        Continue
      </button>
    </div>
  );
};

export default ProjectSelector;
