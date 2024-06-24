import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectDetails from './ProjectDetails';

interface Project {
  id: number;
  name: string;
  status: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Project | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleSort = (column: keyof Project) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);

    const sortedProjects = [...projects].sort((a, b) => {
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setProjects(sortedProjects);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleAddProject = async () => {
    const newProject = { id: 0, name: 'New Project', status: 'active' };
    try {
      await axios.post('/projects', newProject);
      fetchProjects();
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  };

  const handleUpdateProject = async (project: Project) => {
    try {
      await axios.put(`/projects/${project.id}`, project);
      fetchProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDeactivateProject = async (projectId: number) => {
    try {
      await axios.put(`/projects/${projectId}/deactivate`);
      fetchProjects();
    } catch (error) {
      console.error('Failed to deactivate project:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    return project.name.toLowerCase().includes(filter.toLowerCase()) ||
           project.id.toString().includes(filter);
  });

  return (
    <div>
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
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('status')}>Status</th>
            {role !== 'Employee' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.status}</td>
              {role !== 'Employee' && (
                <td>
                  <button onClick={() => handleOpenProject(project)}>Open</button>
                  {role !== 'HR Manager' && (
                    <>
                      <button onClick={() => handleUpdateProject(project)}>Update</button>
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
        <button onClick={handleAddProject}>Add Project</button>
      )}

      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectList;