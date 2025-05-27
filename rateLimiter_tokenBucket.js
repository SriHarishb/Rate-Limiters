const Redis = require('ioredis');
const express = require('express');

const redis = new Redis();
const app = express();
const PORT = process.env.PORT || 3000;

// token bucket config
const key = "TokenBucket";
const bucketSize = 10;
const refilRate = 5000;

// add one token every interval
setInterval(async () => {
    let tokens = await redis.get(key);
    tokens = tokens ? parseInt(tokens) : bucketSize;

    let newTokens = Math.min(bucketSize, tokens + 1);
    await redis.set(key, newTokens);
    console.log("available tokens in bucket -", newTokens);
}, refilRate);

// handle requests using token bucket
app.get('/rateLimiterToken', async (req, res) => {
    let tokens = await redis.get(key);
    tokens = tokens ? parseInt(tokens) : bucketSize;

    if (tokens > 0) {
        await redis.decr(key);
        return res.status(200).json({ message: "success" });
    } else {
        return res.status(429).json({ message: "too many requests" });
    }
});

// start server
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
