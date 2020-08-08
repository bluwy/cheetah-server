import { redis } from '../src/redis'
;(async () => {
  console.log('Flush redis')
  console.log(await redis.flushdb())
  redis.disconnect()
})()
