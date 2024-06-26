import React, { useState } from 'react';
import styles from '../styles/ProjectDetails.module.scss';

interface Project {
  id: number;
  status: string;
  projectType: string;
  startDate: string;
  endDate: string;
  comment: string | null;
  projectManager: {
    id: number;
    fullName: string;
    subdivision: string;
    position: string;
    status: string;
    peoplePartner: string;
    outOfOfficeBalance: number;
    photo: string | null;
    role: {
      id: number;
      name: string;
    };
  };
}

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
  onSave: (updatedProject: Project) => void;
  isEditMode: boolean;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose, onSave, isEditMode }) => {
  const [editedProject, setEditedProject] = useState<Project>({ ...project });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedProject);
    onClose();
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.projectDetailsContainer}>
      <h2>Project Details</h2>
      <p>ID: {project.id}</p>
      <div>
        <label>Status:</label>
        {isEditMode ? (
          <input type="text" name="status" value={editedProject.status} onChange={handleChange} />
        ) : (
          <span>{project.status}</span>
        )}
      </div>
      <div>
        <label>Type:</label>
        {isEditMode ? (
          <input type="text" name="projectType" value={editedProject.projectType} onChange={handleChange} />
        ) : (
          <span>{project.projectType}</span>
        )}
      </div>
      <div>
        <label>Start Date:</label>
        {isEditMode ? (
          <input type="date" name="startDate" value={editedProject.startDate} onChange={handleChange} />
        ) : (
          <span>{formatDate(project.startDate)}</span>
        )}
      </div>
      <div>
        <label>End Date:</label>
        {isEditMode ? (
          <input type="date" name="endDate" value={editedProject.endDate} onChange={handleChange} />
        ) : (
          <span>{formatDate(project.endDate)}</span>
        )}
      </div>
      <div>
        <label>Comment:</label>
        {isEditMode ? (
          <textarea name="comment" value={editedProject.comment || ''} onChange={handleChange} />
        ) : (
          <span>{project.comment}</span>
        )}
      </div>
      <h3>Project Manager</h3>
      <div>
        <label>Full Name:</label>
        {isEditMode ? (
          <input type="text" name="projectManager.fullName" value={editedProject.projectManager.fullName} onChange={handleChange} />
        ) : (
          <span>{project.projectManager.fullName}</span>
        )}
      </div>
      <div>
        <label>Subdivision:</label>
        {isEditMode ? (
          <input type="text" name="projectManager.subdivision" value={editedProject.projectManager.subdivision} onChange={handleChange} />
        ) : (
          <span>{project.projectManager.subdivision}</span>
        )}
      </div>
      <div>
        <label>Position:</label>
        {isEditMode ? (
          <input type="text" name="projectManager.position" value={editedProject.projectManager.position} onChange={handleChange} />
        ) : (
          <span>{project.projectManager.position}</span>
        )}
      </div>
      <div>
        <label>Status:</label>
        {isEditMode ? (
          <input type="text" name="projectManager.status" value={editedProject.projectManager.status} onChange={handleChange} />
        ) : (
          <span>{project.projectManager.status}</span>
        )}
      </div>
      <div>
        <label>People Partner:</label>
        {isEditMode ? (
          <input type="text" name="projectManager.peoplePartner" value={editedProject.projectManager.peoplePartner} onChange={handleChange} />
        ) : (
          <span>{project.projectManager.peoplePartner}</span>
        )}
      </div>
      <div>
        <label>Out of Office Balance:</label>
        {isEditMode ? (
          <input type="number" name="projectManager.outOfOfficeBalance" value={editedProject.projectManager.outOfOfficeBalance} onChange={handleChange} />
        ) : (
          <span>{project.projectManager.outOfOfficeBalance}</span>
        )}
      </div>
      <div>
        <label>Role:</label>
        {isEditMode ? (
          <input type="text" name="projectManager.role.name" value={editedProject.projectManager.role.name} onChange={handleChange} />
        ) : (
          <span>{project.projectManager.role.name}</span>
        )}
      </div>
      {project.projectManager.photo && <img src={project.projectManager.photo} alt="Project Manager" />}
      {isEditMode && <button onClick={handleSave}>Save</button>}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ProjectDetails;