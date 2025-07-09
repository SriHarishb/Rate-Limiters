# Rate Limiter Implementations with Docker and Redis

This repository provides implementations of three common rate-limiting algorithms using Node.js, with Redis used to manage state. The project is containerized using Docker for easy setup and testing.

## Included Rate Limiter Algorithms

- **Fixed Window Counter** – `rateLimiter_fixedWindow.js`  
  Counts requests in fixed time windows (e.g., per minute).

- **Leaky Bucket** – `rateLimiter_leakyBucket.js`  
  Processes requests at a steady rate using a queue mechanism.

- **Token Bucket** – `rateLimiter_tokenBucket.js`  
  Allows bursts of traffic, with tokens replenished at a regular rate.

## Prerequisites

- Docker installed on your system
- (Optional) Docker Compose for simplified container management
- Node.js (if running scripts outside Docker)
