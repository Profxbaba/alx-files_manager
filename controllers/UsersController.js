import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import { ObjectId } from 'mongodb';

class UsersController {
  static async getMe(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Retrieve user ID from Redis using the token
      const userId = await redisClient.get(`auth_${token}`);

      if (!userId) {
        console.log('Token not found in Redis');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Retrieve user from MongoDB
      const db = dbClient.db('files_manager');
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

      if (!user) {
        console.log('User not found in DB');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      res.status(200).json({ id: user._id.toString(), email: user.email });
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UsersController;
