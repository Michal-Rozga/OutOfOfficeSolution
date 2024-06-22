import React from 'react';
import Employee from './EmployeeList';
import Projects from './Projects';
import LeaveRequest from './LeaveRequest';
import ApprovalRequest from './ApprovalRequest';

const Dashboard: React.FC = () => {
  const role = localStorage.getItem('role');

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard!</p>
      <hr />
      <Employee />
      <Projects />
      {role === 'HR Manager' || role === 'Project Manager' ? <LeaveRequest /> : null}
      {role === 'HR Manager' || role === 'Administrator' ? <ApprovalRequest /> : null}
    </div>
  );
};

export default Dashboard;