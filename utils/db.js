const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

class DBClient {
  constructor() {
    this.client = new MongoClient('mongodb://localhost:27017');
    this.client.connect()
      .then(() => {
        this.db = this.client.db('file_manager');
        this.users = this.db.collection('users');
      })
      .catch((error) => console.error('Error connecting to DB:', error));
  }

  // Hash a password
  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
