// @ts-ignore
import RedisMock from 'ioredis-mock'

// https://github.com/stipsan/ioredis-mock/issues/568#issuecomment-613833998
jest.mock('ioredis', () => {
  // @ts-ignore
  const Redis = import('ioredis-mock')

  if (typeof Redis === 'object') {
    return {
      Command: { _transformer: { argument: {}, reply: {} } }
    }
  }

  return Redis
})

export default RedisMock
