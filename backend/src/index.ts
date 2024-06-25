import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
import { Employee } from './entity/Employee';
import { Project } from './entity/Project';
import { ApprovalRequest } from './entity/ApprovalRequest';
import { LeaveRequest } from './entity/LeaveRequest';
import { Role } from './entity/Role';
import cors from 'cors';

createConnection().then(async connection => {
  const app = express();
  const port = 5000;

  app.use(express.json());
  app.use(cors());

  app.get('/roles', async (req, res) => {
  try {
    const roles = await connection.getRepository(Role).find();
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

app.get('/approval-requests', async (req, res) => {
  try {
    const requests = await connection.getRepository(ApprovalRequest).find();
    res.json(requests);
  } catch (error) {
    console.error('Failed to fetch approval requests:', error);
    res.status(500).send('Failed to fetch approval requests');
  }
});

app.put('/approval-requests/:id/approve', async (req, res) => {
  try {
    const request = await connection.getRepository(ApprovalRequest).findOne({ where: { id: parseInt(req.params.id) } });
    if (request) {
      request.status = 'approved';
      await connection.getRepository(ApprovalRequest).save(request);
      res.send('Request approved successfully');
    } else {
      res.status(404).send('Request not found');
    }
  } catch (error) {
    console.error('Failed to approve request:', error);
    res.status(500).send('Failed to approve request');
  }
});

app.put('/approval-requests/:id/reject', async (req, res) => {
  try {
    const { comment } = req.body;
    const request = await connection.getRepository(ApprovalRequest).findOne({ where: { id: parseInt(req.params.id) } });
    if (request) {
      request.status = 'rejected';
      await connection.getRepository(ApprovalRequest).save(request);
      res.send('Request rejected successfully');
    } else {
      res.status(404).send('Request not found');
    }
  } catch (error) {
    console.error('Failed to reject request:', error);
    res.status(500).send('Failed to reject request');
  }
});

app.post('/leave-requests', async (req, res) => {
  try {
    const newRequest = req.body;
    const leaveRequest = await connection.getRepository(LeaveRequest).save(newRequest);
    res.status(201).json(leaveRequest);
  } catch (error) {
    console.error('Failed to create leave request:', error);
    res.status(500).send('Failed to create leave request');
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

app.post('/projects', async (req, res) => {
  try {
    const project = await connection.getRepository(Project).save(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error('Failed to create project:', error);
    res.status(500).send('Failed to create project');
  }
});

app.put('/projects/:id', async (req, res) => {
  try {
    const project = await connection.getRepository(Project).findOneBy({ id: parseInt(req.params.id) });
    if (project) {
      connection.getRepository(Project).merge(project, req.body);
      await connection.getRepository(Project).save(project);
      res.send('Project updated successfully');
    } else {
      res.status(404).send('Project not found');
    }
  } catch (error) {
    console.error('Failed to update project:', error);
    res.status(500).send('Failed to update project');
  }
});

app.put('/projects/:id/deactivate', async (req, res) => {
  try {
    const project = await connection.getRepository(Project).findOneBy({ id: parseInt(req.params.id) });
    if (project) {
      project.status = 'closed';
      await connection.getRepository(Project).save(project);
      res.send('Project deactivated successfully');
    } else {
      res.status(404).send('Project not found');
    }
  } catch (error) {
    console.error('Failed to deactivate project:', error);
    res.status(500).send('Failed to deactivate project');
  }
});

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(error => console.error('Database connection error:', error));