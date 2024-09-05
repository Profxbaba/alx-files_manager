import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';  // Ensure this URL is correct
const dbName = 'files_manager';  // Ensure this database name is correct

const dbClient = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

dbClient.connect((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB', err);
  } else {
    console.log('Connected to MongoDB');
  }
});

export default dbClient;
