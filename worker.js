const Bull = require('bull');
const dbClient = require('./utils/db');

// Create the userQueue
const userQueue = new Bull('userQueue', 'redis://127.0.0.1:6379');

// Process the queue
userQueue.process(async (job, done) => {
  const { userId } = job.data;

  // Check if userId is present
  if (!userId) {
    done(new Error('Missing userId'));
    return;
  }

  try {
    // Find the user by userId in the DB
    const user = await dbClient.users.findOne({ _id: userId });
    
    if (!user) {
      done(new Error('User not found'));
      return;
    }

    // In a real application, this would send an email via a third-party service
    console.log(`Welcome ${user.email}!`);

    done();
  } catch (error) {
    done(error);
  }
});
