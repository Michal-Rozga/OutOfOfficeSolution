import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
import { Employee } from './entity/Employee';
import { Project } from './entity/Project';
import cors from 'cors';

createConnection().then(async connection => {
  const app = express();
  const port = 5000;

  app.use(express.json());
  app.use(cors());

  app.get('/roles', async (req, res) => {
    try {
      const roles = await connection.getRepository(Employee).find({ select: ['id', 'role'] });
      res.json(roles);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      res.status(500).send('Failed to fetch roles');
    }
  });

  app.get('/employees', async (req, res) => {
    try {
      const employees = await connection.getRepository(Employee).find();
      res.json(employees);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      res.status(500).send('Failed to fetch employees');
    }
  });

  app.get('/projects', async (req, res) => {
    try {
      const projects = await connection.getRepository(Project).find();
      res.json(projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      res.status(500).send('Failed to fetch projects');
    }
  });
  

  app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).send('Username, password, and role are required');
    }

    try {
      let employee = await connection.getRepository(Employee).findOne({ where: { role } });

      if (!employee) {
        employee = new Employee();
        employee.role = role;
        await connection.getRepository(Employee).save(employee);
      }

      const user = new User();
      user.username = username;
      user.password = password;
      user.employee = employee;

      const userRepository = connection.getRepository(User);
      await userRepository.save(user);

      res.send('User registered successfully');
    } catch (error) {
      console.error('Registration failed:', error);
      res.status(500).send('Registration failed');
    }
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const userRepository = connection.getRepository(User);
      const user = await userRepository.findOne({ where: { username }, relations: ['employee'] });

      if (user && user.password === password) {
        res.send({ message: 'Login successful', role: user.employee.role });
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      res.status(500).send('Login failed');
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(error => console.error('Database connection error:', error));