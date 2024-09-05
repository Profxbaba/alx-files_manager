import redis from 'redis';

const redisClient = redis.createClient({
  host: 'localhost', // Update if needed
  port: 6379          // Update if needed
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redisClient;
