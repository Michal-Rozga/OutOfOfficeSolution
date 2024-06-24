import React from 'react';
import ApprovalRequest from './ApprovalRequestList';
import EmployeeList from './EmployeeList';
import LeaveRequest from './LeaveRequest';
import Projects from './Projects';

const Dashboard: React.FC = () => {
  const role = localStorage.getItem('role');

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard!</p>
      <hr />
      <EmployeeList />
      <Projects />
      {role === 'HR Manager' || role === 'Project Manager' ? <LeaveRequest /> : null}
      {role === 'HR Manager' || role === 'Administrator' ? <ApprovalRequest /> : null}
    </div>
  );
};

export default Dashboard;