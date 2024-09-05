import express from 'express';
import dbClient from './utils/db';
import redisClient from './utils/redis';

const app = express();
const port = process.env.PORT || 5001;

app.get('/status', async (req, res) => {
  try {
    const dbStatus = await dbClient.isAlive();
    const redisStatus = await redisClient.ping();
    res.json({ redis: redisStatus, db: dbStatus });
  } catch (error) {
    console.error('Error checking status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/stats', async (req, res) => {
  try {
    const [usersCount, filesCount] = await Promise.all([
      dbClient.nbUsers(),
      dbClient.nbFiles()
    ]);
    res.json({ users: usersCount, files: filesCount });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
