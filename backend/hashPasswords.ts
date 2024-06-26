import { createConnection } from 'typeorm';
import { User } from './src/entity/User';
import bcrypt from 'bcrypt';

createConnection().then(async connection => {
  const userRepository = connection.getRepository(User);
  const users = await userRepository.find();

  for (const user of users) {
    if (!user.password.startsWith('$2b$')) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      await userRepository.save(user);
    }
  }

  console.log('Passwords hashed successfully');
  await connection.close();
}).catch(error => console.error('Database connection error:', error));
