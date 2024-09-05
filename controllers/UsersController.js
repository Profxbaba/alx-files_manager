// controllers/UsersController.js
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'files_manager';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Connect to MongoDB
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const usersCollection = db.collection('users');

      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

      // Insert new user into the database
      const result = await usersCollection.insertOne({ email, password: hashedPassword });

      // Return the newly created user
      return res.status(201).json({ id: result.insertedId, email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      client.close();
    }
  }
}

module.exports = UsersController;
