import Redis from 'ioredis'

// Redis setup
// - Single client only since JS and Redis are both single-threaded
// - Share a single database since they're no advantage otherwise
// - Lazy because I don't want the console to be blasted with connection errors
//   while writing Nexus code with Docker not upped

const REDIS_URL = process.env.REDIS_URL

export const redis =
  process.env.NODE_ENV === 'test'
    ? new Redis({ lazyConnect: true })
    : new Redis(REDIS_URL, { lazyConnect: true })

if (process.env.NODE_ENV === 'development' && process.env.LOG_REDIS) {
  redis.on('connect', async () => {
    const monitor = await redis.monitor()
    monitor.on('monitor', (_, cmd) => {
      console.log('[REDIS]')
      console.log(cmd.join(' '))
      console.log()
    })
  })
}
