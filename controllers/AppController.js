// controllers/AppController.js
const dbClient = require('../utils/db'); // Ensure this path is correct
const redisClient = require('../utils/redis'); // Ensure this path is correct

const getStatus = async (req, res) => {
  try {
    const dbStatus = await dbClient.isAlive();
    const redisStatus = await redisClient.ping();
    res.status(200).json({ redis: redisStatus, db: dbStatus });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const usersCount = await dbClient.countUsers();
    const filesCount = await dbClient.countFiles();
    res.status(200).json({ users: usersCount, files: filesCount });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getStatus, getStats };
