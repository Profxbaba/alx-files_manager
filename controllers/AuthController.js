import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.slice('Basic '.length).trim();
    const [email, password] = Buffer.from(base64Credentials, 'base64').toString().split(':');

    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const db = dbClient.db('files_manager');
      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
      const user = await db.collection('users').findOne({ email, password: hashedPassword });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = uuidv4();
      await redisClient.setex(`auth_${token}`, 24 * 60 * 60, user._id.toString());

      res.status(200).json({ token });
    } catch (error) {
      console.error('Error connecting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const result = await redisClient.del(`auth_${token}`);

      if (result === 0) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error disconnecting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default AuthController;
