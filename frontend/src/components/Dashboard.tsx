import React from 'react';
import ApprovalRequest from './ApprovalRequestList';
import EmployeeList from './EmployeeList';
import LeaveRequest from './LeaveRequestList';
import Projects from './ProjectList';
import ProjectList from './ProjectList';

const Dashboard: React.FC = () => {
  const role = localStorage.getItem('role');

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard!</p>
      <hr />
      <EmployeeList />
      <ProjectList />
      {role === 'HR Manager' || role === 'Project Manager' ? <LeaveRequest /> : null}
      {role === 'HR Manager' || role === 'Administrator' ? <ApprovalRequest /> : null}
    </div>
  );
};

export default Dashboard;