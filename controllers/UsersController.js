// Import the Bull queue
const Bull = require('bull');
const dbClient = require('../utils/db');

// Create the userQueue
const userQueue = new Bull('userQueue', 'redis://127.0.0.1:6379');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const userExists = await dbClient.users.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ error: 'Already exists' });
    }

    const hashedPassword = await dbClient.hashPassword(password);

    const newUser = await dbClient.users.insertOne({
      email,
      password: hashedPassword,
    });

    const userId = newUser.insertedId;

    // Add a job to the queue to send a welcome email
    userQueue.add({ userId });

    return res.status(201).json({ id: userId, email });
  }
}

module.exports = UsersController;
