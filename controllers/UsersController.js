import crypto from 'crypto';
import dbClient from '../utils/db';  // Ensure this path is correct

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const db = dbClient.db('files_manager');  // Ensure database name is correct
      const existingUser = await db.collection('users').findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

      const result = await db.collection('users').insertOne({
        email,
        password: hashedPassword
      });

      const newUser = result.ops[0];
      res.status(201).json({
        id: newUser._id,
        email: newUser.email
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UsersController;
