import { Redis } from "@upstash/redis";
require("dotenv").config();

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

async function initRedis() {
  try {
    await redis.set("connection_test", "ok");
    const result = await redis.get("connection_test");
    if (result === "ok") {
      console.log("Redis connected to Upstash");
    } else {
      console.error("Redis connection test failed");
    }
  } catch (err) {
    console.error("Redis error:", err);
  }
}

initRedis();

export { redis };
