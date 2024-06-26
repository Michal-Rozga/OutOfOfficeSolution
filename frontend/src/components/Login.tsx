import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Login.module.scss';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      setMessage(response.data.message);

      if (response.data.role) {
        localStorage.setItem('role', JSON.stringify(response.data.role));
        navigate('/dashboard');
      } else {
        setMessage('Login failed: Role not found');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error);
        setMessage(`Login failed: ${error.message}`);
      } else {
        console.error('Unexpected error:', error);
        setMessage('Login failed: Unexpected error');
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;