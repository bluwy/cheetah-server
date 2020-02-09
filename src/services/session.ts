import { AuthenticationError } from 'apollo-server'
import Redis from 'ioredis'
import nanoid from 'nanoid'

// How this Redis session db works?
//
// - Structure: Key to value => "user:<user-id>" to sorted set.
//
// - Sorted set is of session ids with score of expiration dates.
//
// - Whenever we login, we create a new session by creating a session id with
//   its expiration date and add into the user's sorted set.
//
// - Whenever a request is sent, we validate it by checking if session id is in
//   the user's sorted set.
//
// - Before querying its existence, we remove all the expired sessions.
//
// - After querying and if true, we also check if we want to renew it, based on
//   the `renewSessionInterval` so active users don't need to re-login everytime
//   the session expires.
//
// - NOTE: The session token is of format: <user-id>:<session-id>. This is so
//   clients only need to maintain one token for authentication.

// Redis setup
const redis = new Redis(process.env.REDIS_URL)

// Everytime a session is active, renew it only between each interval in ms
const renewSessionInterval = 1 * 60 * 60 * 1000 // 1 day

// Session time-to-live in ms
const sessionTTL = 7 * 24 * 60 * 60 * 1000 // 7 days

/** Utils to encode and decode a session token */
export class SessionToken {
  private static readonly separator = ':'

  static encode(userId: string, sessionId: string) {
    return userId + this.separator + sessionId
  }

  static decode(sessionToken: string) {
    const separatorIndex = sessionToken.indexOf(this.separator)
    const userId = sessionToken.substring(0, separatorIndex)
    const sessionId = sessionToken.substring(separatorIndex)

    if (!userId || !sessionId) {
      throw new AuthenticationError('Invalid session token')
    }

    return { userId, sessionId }
  }
}

/** Saves a user session in Redis, returns the session token  */
export async function createSession(userId: string): Promise<string> {
  const key = 'user:' + userId
  const sessionId = nanoid()
  const score = getSessionExpirationDate()

  // Adds the session id with expiration date
  // NX: No update, only add
  await redis.zadd(key, 'NX', `${score}`, sessionId)

  return SessionToken.encode(userId, sessionId)
}

/** Checks session exist for session token, returns undefined if none found */
export async function sessionExists(sessionToken: string): Promise<boolean> {
  const { userId, sessionId } = SessionToken.decode(sessionToken)
  const key = 'user:' + userId

  // Remove expired sessions for key
  await redis.zremrangebyscore(key, '-inf', Date.now())

  const expirationDate = +(await redis.zscore(key, sessionId))

  // If has expiration date (exist) and eligible to renew session
  if (expirationDate && Date.now() - expirationDate > renewSessionInterval) {
    const newScore = getSessionExpirationDate()
    // Updates the session id with new expiration date
    // XX: Only update, no add
    await redis.zadd(key, 'XX', `${newScore}`, sessionId)
  }

  return !!expirationDate
}

function getSessionExpirationDate() {
  return Date.now() + sessionTTL
}
