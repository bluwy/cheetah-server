import { CookieOptions, Request, Response } from 'express'
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

// Redis setup (Single client only since JS and Redis are both single-threaded)
const redis = new Redis(process.env.REDIS_URL)

export class SessionService {
  readonly userIdCookie = 'connect.userid'
  readonly sessionIdCookie = 'connect.sessionid'
  readonly userIdKeyPrefix = 'user:'

  // Everytime a session is active, renew it only between each interval in ms
  readonly renewSessionInterval = 1 * 60 * 60 * 1000 // 1 day
  // Session time-to-live in ms
  readonly sessionTTL = 7 * 24 * 60 * 60 * 1000 // 7 days

  constructor(private req: Request, private res: Response) {}

  /** Creates a session in Redis and add required cookies for authentication */
  async createSession(userId: string): Promise<void> {
    const sessionId = await this.redisCreateSession(userId)
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    }

    this.res
      .cookie(this.userIdCookie, userId, cookieOptions)
      .cookie(this.sessionIdCookie, sessionId, cookieOptions)
  }

  /** Reads the cookie and check validity of cookie in Redis */
  async checkSession(): Promise<boolean> {
    const userId: string | undefined = this.req.cookies[this.userIdCookie]
    const sessionId: string | undefined = this.req.cookies[this.sessionIdCookie]

    if (!userId || !sessionId) {
      return false
    }

    const expire = await this.redisGetSessionExpire(userId, sessionId)

    // If has expiration date (exist) and eligible to renew session
    if (expire && Date.now() - expire > this.renewSessionInterval) {
      this.req.cookies()
      await this.redisResetSessionExpire(userId, sessionId)
    }

    return !!expire
  }

  /** Saves a user session in Redis, returns the session id  */
  private async redisCreateSession(userId: string): Promise<string> {
    const key = this.getUserIdKey(userId)
    const sessionId = nanoid()
    const score = this.getSessionExpire()

    // Adds the session id with expiration date
    // NX: No update, only add
    await redis.zadd(key, 'NX', `${score}`, sessionId)

    return sessionId
  }

  /**
   * Gets session expiration date in ms for user id and session id,
   * returns undefined if none found
   */
  private async redisGetSessionExpire(
    userId: string,
    sessionId: string
  ): Promise<number> {
    const key = this.getUserIdKey(userId)

    // Remove expired sessions for key
    await redis.zremrangebyscore(key, '-inf', Date.now())

    const expire = +(await redis.zscore(key, sessionId))

    return expire
  }

  /** Resets the session expiration date */
  private async redisResetSessionExpire(
    userId: string,
    sessionId: string
  ): Promise<void> {
    const key = this.getUserIdKey(userId)
    const newScore = this.getSessionExpire()

    // Updates the session id with new expiration date
    // XX: Only update, no add
    await redis.zadd(key, 'XX', `${newScore}`, sessionId)
  }

  private getUserIdKey(userId: string) {
    return this.userIdKeyPrefix + userId
  }

  private getSessionExpire() {
    return Date.now() + this.sessionTTL
  }
}
