import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;
    
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.db = null;

    // Connect to MongoDB and set this.db once connected
    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
        // console.log('Connected to MongoDB');
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
      });
  }

  async isAlive() {
    try {
      await this.db.command({ ping: 1 });
      return true;
    } catch (error) {
      console.error('MongoDB ping failed:', error);
      return false;
    }
  }

  async nbUsers() {
    if (!this.db) return 0;
    try {
      return await this.db.collection('users').countDocuments();
    } catch (error) {
      console.error('Failed to count documents in users collection:', error);
      return 0;
    }
  }

  async nbFiles() {
    if (!this.db) return 0;
    try {
      return await this.db.collection('files').countDocuments();
    } catch (error) {
      console.error('Failed to count documents in files collection:', error);
      return 0;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
