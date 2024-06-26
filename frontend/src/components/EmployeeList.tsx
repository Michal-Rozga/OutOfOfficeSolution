import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRole } from '../contexts/RoleContext';
import styles from '../styles/EmployeeList.module.scss';

interface Employee {
  id: number;
  fullName: string;
  subdivision: string;
  position: string;
  status: string;
  role: {
    id: number;
    name: string;
  };
}

interface Project {
  id: number;
  projectType: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Employee; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const { role } = useRole();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get<Employee[]>('http://localhost:5000/employees');
        console.log('Fetched employees:', response.data);
        setEmployees(response.data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSort = (key: keyof Employee) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = React.useMemo(() => {
    let sortableEmployees = [...employees];
    if (sortConfig !== null) {
      sortableEmployees.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEmployees;
  }, [employees, sortConfig]);

  const filteredEmployees = sortedEmployees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: number) => {
    const employee = employees.find(e => e.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      setShowEditForm(true);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/employees/${id}`, { status: 'inactive' });
      setEmployees(employees.map(e => (e.id === id ? { ...e, status: 'inactive' } : e)));
    } catch (error) {
      console.error('Failed to deactivate employee:', error);
    }
  };

  const handleViewDetails = (id: number) => {
    const employee = employees.find(e => e.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      setShowDetailsForm(true);
    }
  };

  const handleAssignToProject = (id: number) => {
    const employee = employees.find(e => e.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      setShowAssignForm(true);
    }
  };

  const handleAddEmployee = () => {
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowEditForm(false);
    setShowDetailsForm(false);
    setShowAddForm(false);
    setShowAssignForm(false);
    setSelectedEmployee(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Employee List</h2>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('fullName')}>Name</th>
              <th onClick={() => handleSort('subdivision')}>Subdivision</th>
              <th onClick={() => handleSort('position')}>Position</th>
              <th onClick={() => handleSort('status')}>Status</th>
              <th onClick={() => handleSort('role')}>Role</th>
              {(role === 'HR Manager' || role === 'Administrator') && <th className={styles.actions}>Actions</th>}
              {(role === 'Project Manager' || role === 'Administrator') && <th>Details</th>}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.fullName}</td>
                <td>{employee.subdivision}</td>
                <td>{employee.position}</td>
                <td>{employee.status}</td>
                <td>{employee.role.name}</td>
                {(role === 'HR Manager' || role === 'Administrator') && (
                  <td className={styles.actions}>
                    <button onClick={() => handleEdit(employee.id)}>Edit</button>
                    <button onClick={() => handleDeactivate(employee.id)}>Deactivate</button>
                  </td>
                )}
                {(role === 'Project Manager' || role === 'Administrator') && (
                  <td>
                    <button onClick={() => handleViewDetails(employee.id)}>View Details</button>
                    <button onClick={() => handleAssignToProject(employee.id)}>Assign to Project</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(role === 'HR Manager' || role === 'Administrator') && (
        <div className={styles.formContainer}>
          <button onClick={handleAddEmployee}>Add Employee</button>
        </div>
      )}

      {showEditForm && selectedEmployee && (
        <EditEmployeeForm employee={selectedEmployee} onClose={handleFormClose} />
      )}
      {showDetailsForm && selectedEmployee && (
        <EmployeeDetailsForm employee={selectedEmployee} onClose={handleFormClose} />
      )}
      {showAddForm && (
        <AddEmployeeForm onClose={handleFormClose} />
      )}
      {showAssignForm && selectedEmployee && (
        <AssignProjectForm employee={selectedEmployee} onClose={handleFormClose} />
      )}
    </div>
  );
};

const EditEmployeeForm: React.FC<{ employee: Employee; onClose: () => void }> = ({ employee, onClose }) => {
  const [formData, setFormData] = useState(employee);

  useEffect(() => {
    console.log('EditEmployeeForm mounted with employee:', employee);
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/employees/${employee.id}`, formData);
      onClose();
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>Edit Employee</h2>
      <label>
        Name:
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
      </label>
      <label>
        Subdivision:
        <input type="text" name="subdivision" value={formData.subdivision} onChange={handleChange} />
      </label>
      <label>
        Position:
        <input type="text" name="position" value={formData.position} onChange={handleChange} />
      </label>
      <label>
        Status:
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>
      <label>
        Role:
        <input type="text" name="role" value={formData.role.name} onChange={handleChange} />
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

const EmployeeDetailsForm: React.FC<{ employee: Employee; onClose: () => void }> = ({ employee, onClose }) => {
  useEffect(() => {
    console.log('EmployeeDetailsForm mounted with employee:', employee);
  }, [employee]);

  return (
    <div className={styles.detailsForm}>
      <h2>Employee Details</h2>
      <p><strong>Name:</strong> {employee.fullName}</p>
      <p><strong>Subdivision:</strong> {employee.subdivision}</p>
      <p><strong>Position:</strong> {employee.position}</p>
      <p><strong>Status:</strong> {employee.status}</p>
      <p><strong>Role:</strong> {employee.role.name}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const AddEmployeeForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<Employee>({
    id: 0,
    fullName: '',
    subdivision: '',
    position: '',
    status: 'active',
    role: { id: 0, name: '' },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/employees', formData);
      onClose();
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>Add Employee</h2>
      <label>
        Name:
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
      </label>
      <label>
        Subdivision:
        <input type="text" name="subdivision" value={formData.subdivision} onChange={handleChange} />
      </label>
      <label>
        Position:
        <input type="text" name="position" value={formData.position} onChange={handleChange} />
      </label>
      <label>
        Status:
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>
      <label>
        Role:
        <input type="text" name="role" value={formData.role.name} onChange={handleChange} />
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

const AssignProjectForm: React.FC<{ employee: Employee; onClose: () => void }> = ({ employee, onClose }) => {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<Project[]>('http://localhost:5000/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (projectId !== null) {
      try {
        await axios.post(`http://localhost:5000/projects/${projectId}/assign`, { employeeId: employee.id });
        onClose();
      } catch (error) {
        console.error('Failed to assign project:', error);
      }
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>Assign Project</h2>
      <label>
        Project:
        <select value={projectId ?? ''} onChange={(e) => setProjectId(Number(e.target.value))}>
          <option value="" disabled>Select a project</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.projectType}</option>
          ))}
        </select>
      </label>
      <button type="submit">Assign</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default EmployeeList;