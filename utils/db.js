import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017/files_manager'; // Update if needed
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
  if (err) {
    console.error('MongoDB connection error:', err);
  }
});

export default client;
