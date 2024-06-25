import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { RoleProvider } from './contexts/RoleContext';

const App: React.FC = () => {
  return (
    <Router>
      <RoleProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </RoleProvider>
    </Router>
  );
};

export default App;