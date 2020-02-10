import Redis from 'ioredis'

// Redis setup
// - Single client only since JS and Redis are both single-threaded
// - Share a single database since they're no advantage otherwise

export const redis = new Redis(process.env.REDIS_URL)
