const Redis = require('ioredis');
const express = require('express');

const redis = new Redis();
const app = express();
const PORT = process.env.PORT || 3000;

// leaky bucket config
const key = "LeakyBucket";
const bucketSize = 10;
const leakRate = 5000;

// leak one request every interval
setInterval(async () => {
    const count = await redis.llen(key);
    if (count > 0) {
        await redis.rpop(key);
        console.log("leaked and processing a request, pending", count - 1);
    }
}, leakRate);

// apply rate limiting using leaky bucket
app.get('/rateLimiterLeak', async (req, res) => {
    const count = await redis.llen(key);

    if (count < bucketSize) {
        await redis.lpush(key, Date.now());
        return res.status(200).json({ message: "success" });
    } else {
        return res.status(429).json({ message: "too many requests" });
    }
});

// start server
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
