import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectDetails from './ProjectDetails';
import { useRole } from '../contexts/RoleContext';
import styles from '../styles/ProjectList.module.scss';

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

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Project | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { role } = useRole();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get<Project[]>('http://localhost:5000/projects');
      setProjects(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleSort = (column: keyof Project) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);

    const sortedProjects = [...projects].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue === null || bValue === null) return 0;

      if (column === 'startDate' || column === 'endDate') {
        const dateA = new Date(aValue as string);
        const dateB = new Date(bValue as string);
        if (dateA < dateB) return direction === 'asc' ? -1 : 1;
        if (dateA > dateB) return direction === 'asc' ? 1 : -1;
        return 0;
      } else {
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      }
    });

    setProjects(sortedProjects);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditMode(false);
  };

  const handleAddProject = async () => {
    const newProject = { id: 0, status: 'active', projectType: '', startDate: '', endDate: '', comment: null, projectManager: {
        id: 0,
        fullName: '',
        subdivision: '',
        position: '',
        status: '',
        peoplePartner: '',
        outOfOfficeBalance: 0,
        photo: null,
        role: {
          id: 0,
          name: '',
        },
      }};
    try {
      await axios.post('http://localhost:5000/projects', newProject);
      fetchProjects();
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  };

  const handleUpdateProject = async (project: Project) => {
    try {
      await axios.put(`http://localhost:5000/projects/${project.id}`, project);
      fetchProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDeactivateProject = async (projectId: number) => {
    try {
      await axios.put(`http://localhost:5000/projects/${projectId}/deactivate`);
      fetchProjects();
    } catch (error) {
      console.error('Failed to deactivate project:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    return project.projectType.toLowerCase().includes(filter.toLowerCase()) ||
           project.id.toString().includes(filter);
  });

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.projectListContainer}>
      <h1>Project List</h1>
      <input
        type="text"
        placeholder="Search by project name or ID"
        value={filter}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID</th>
            <th onClick={() => handleSort('status')}>Status</th>
            <th onClick={() => handleSort('projectType')}>Type</th>
            <th onClick={() => handleSort('startDate')}>Start Date</th>
            <th onClick={() => handleSort('endDate')}>End Date</th>
            <th>Project Manager</th>
            {role !== 'Employee' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.status}</td>
              <td>{project.projectType}</td>
              <td>{formatDate(project.startDate)}</td>
              <td>{formatDate(project.endDate)}</td>
              <td>{project.projectManager.fullName}</td>
              {role !== 'Employee' && (
                <td>
                  <button onClick={() => handleOpenProject(project)}>Open</button>
                  {role !== 'HR Manager' && (
                    <>
                      <button onClick={() => { handleOpenProject(project); setIsEditMode(true); }}>Update</button>
                      <button onClick={() => handleDeactivateProject(project.id)}>Deactivate</button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {role !== 'Employee' && (
        <button className={styles.addProjectButton} onClick={handleAddProject}>Add Project</button>
      )}

      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSave={handleUpdateProject}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

export default ProjectList;