import Redis from 'ioredis'

// Redis setup
// - Single client only since JS and Redis are both single-threaded
// - Share a single database since they're no advantage otherwise
// - Lazy because I don't want the console to be blasted with connection errors
//   while writing Nexus code with Docker not upped

export const redis = new Redis(process.env.REDIS_URL, { lazyConnect: true })
