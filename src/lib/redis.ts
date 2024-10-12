import Redis from 'ioredis';
import { env } from '$env/dynamic/private';

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_POR,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD
});

export default redis;
