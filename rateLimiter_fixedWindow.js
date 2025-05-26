const Redis = require('ioredis');
const express = require('express');

const redis = new Redis();
const app = express();
const PORT = process.env.PORT || 3000;

// time window and max allowed requests per ip
const windowSize = 60;
const maxSize = 10;

// middleware to limit request rate per ip
const rateLimiter = async (req, res, next) => {
    const ip = req.ip;
    const key = `rate_limiter${ip}`;
    try {
        // get current request count for this ip from redis
        let requests = await redis.get(key);

        if (requests == null) {
            // if no count found, set to 1 with expiry (windowSize seconds)
            await redis.set(key, 1, "EX", windowSize);
            requests = 1;
        } else {
            // increment the existing count
            requests = await redis.incr(key);
        }
        console.log(`IP ${ip}`, "\nrequests-", requests);

        // if requests exceed max allowed, block request
        if (requests > maxSize) {
            return res.status(429).json({ message: "too many reqs" });
        }
        // store request count in req object for later use
        req.reqCount = requests;
        next(); // allow next middleware or route to run
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// apply the rateLimiter middleware to all routes
app.use(rateLimiter);

// sample route to check requests count
app.get('/rateLimiters', async (req, res) => {
    res.send(`Max no. of reqs per minute = 10 <br> Current number of requests: ${req.reqCount}`);
});

// start the server
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
