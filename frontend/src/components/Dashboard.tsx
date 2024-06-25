import React from 'react';
import { useRole } from '../contexts/RoleContext';
import LeaveRequestList from './LeaveRequestList';
import ApprovalRequestList from './ApprovalRequestList';
import EmployeeList from './EmployeeList';
import ProjectList from './ProjectList';

const Dashboard: React.FC = () => {
  const { role } = useRole();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard!</p>
      <hr />
      {role === 'Administrator' || role === 'HR Manager' || role === 'Project Manager' ? <EmployeeList /> : null}
      <ProjectList />
      {role === 'Administrator' || role === 'HR Manager' || role === 'Project Manager' ? <LeaveRequestList /> : null}
      {role === 'Administrator' || role === 'HR Manager' || role === 'Project Manager' ? <ApprovalRequestList /> : null}
    </div>
  );
};

export default Dashboard;