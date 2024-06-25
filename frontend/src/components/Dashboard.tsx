import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeaveRequestList from './LeaveRequestList';
import ApprovalRequestList from './ApprovalRequestList';

interface Role {
  id: number;
  name: string;
}

const Dashboard: React.FC = () => {
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get<Role[]>('http://localhost:5000/roles');
        const roles = response.data;

        const storedRole = localStorage.getItem('role');
        if (!storedRole) {
          console.error('No role found in localStorage');
          return;
        }

        const roleId = parseInt(storedRole, 10);
        if (isNaN(roleId)) {
          console.error('Role ID from localStorage is not a valid number:', storedRole);
          return;
        }

        const selectedRole = roles.find(r => r.id === roleId);
        if (selectedRole) {
          setRole(selectedRole.name);
        } else {
          console.error('Role not found in roles:', roleId);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRole();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard!</p>
      <hr />
      {role === 'HR Manager' || role === 'Project Manager' ? <LeaveRequestList /> : null}
      {role === 'HR Manager' || role === 'Administrator' ? <ApprovalRequestList /> : null}
    </div>
  );
};

export default Dashboard;