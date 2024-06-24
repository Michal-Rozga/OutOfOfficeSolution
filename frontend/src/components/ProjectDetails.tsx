import React from 'react';

interface Project {
  id: number;
  name: string;
  status: string;
}

const ProjectDetails: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  return (
    <div>
      <h2>Project Details</h2>
      <p>ID: {project.id}</p>
      <p>Name: {project.name}</p>
      <p>Status: {project.status}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ProjectDetails;