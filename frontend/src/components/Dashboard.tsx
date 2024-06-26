import React from 'react';
import { useRole } from '../contexts/RoleContext';
import styles from '../styles/Dashboard.module.scss';
import ApprovalRequestList from './ApprovalRequestList';
import EmployeeList from './EmployeeList';
import LeaveRequestList from './LeaveRequestList';
import ProjectList from './ProjectList';

const Dashboard: React.FC = () => {
  const { role } = useRole();

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Dashboard</h2>
      <p className={styles.welcomeText}>Welcome to the dashboard!</p>
      <hr />
      {role === 'Administrator' || role === 'HR Manager' || role === 'Project Manager' ? (
        <div className={styles.section}><EmployeeList /></div>
      ) : null}
      <div className={styles.section}><ProjectList /></div>
      {role === 'Administrator' || role === 'HR Manager' || role === 'Project Manager' ? (
        <div className={styles.section}><LeaveRequestList /></div>
      ) : null}
      {role === 'Administrator' || role === 'HR Manager' || role === 'Project Manager' ? (
        <div className={styles.section}><ApprovalRequestList /></div>
      ) : null}
    </div>
  );
};

export default Dashboard;
