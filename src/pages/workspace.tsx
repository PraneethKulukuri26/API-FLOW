import React from "react";
import ProjectSelector from '../components/ProjectSelector';
import { useDispatch } from 'react-redux';
import { setProject } from '../features/projectSlice';

const WorkSpace = () => {
    const dispatch = useDispatch();

    const handleProjectCreated = (project: { name: string; description?: string }) => {
        // You may want to pass more details if available
        dispatch(setProject({
            id: '', // Fill with actual id if available
            title: project.name,
            description: project.description || '',
        }));
    };

    return <ProjectSelector onProjectCreated={handleProjectCreated} />;
};

export default WorkSpace; 