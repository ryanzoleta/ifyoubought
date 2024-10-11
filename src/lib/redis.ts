import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost', // or your Redis server host
  port: 6379 // default Redis port
  // Add any other options here
});

export default redis;
