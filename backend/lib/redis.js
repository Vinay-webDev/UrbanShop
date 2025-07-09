import Redis from "ioredis"
import dotenv from 'dotenv'
dotenv.config();


export const redis = new Redis(process.env.UPSTASH_REDIS_URL);





// import dotenv from 'dotenv'
// dotenv.config();
// import Redis from "ioredis"
// export const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_URL,
//   token: process.env.UPSTASH_REDIS_TOKEN,
// })

// await redis.set("foo", "bar");
// await redis.get("foo");


