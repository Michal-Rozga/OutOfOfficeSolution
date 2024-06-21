import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { User } from './entity/User';

createConnection().then(async connection => {
  const app = express();
  const port = 5000;

  app.use(express.json());

  app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const user = new User();
    user.username = username;
    user.password = password;
    user.role = role;

    const userRepository = connection.getRepository(User);
    await userRepository.save(user);

    res.send('User registered successfully');
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const userRepository = connection.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    if (user && user.password === password) {
      res.send({ message: 'Login successful', role: user.role });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(error => console.log(error));