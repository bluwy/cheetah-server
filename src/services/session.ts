import { ForbiddenError } from 'apollo-server-express'
import { CookieOptions, Request, Response } from 'express'
import nanoid from 'nanoid'
import { redis } from './redis'
import { getEnvVar } from '../utils/common'

export const sessionIdLength = +getEnvVar('SESSION_ID_LENGTH')
export const sessionCookieName = getEnvVar('SESSION_COOKIE_NAME')
export const expireKeyPrefix = getEnvVar('SESSION_EXPIRE_KEY_PREFIX')
export const sessionKeyPrefix = getEnvVar('SESSION_SESSION_KEY_PREFIX')

// Everytime a session is active, renew it only between each interval in ms
export const renewSessionInterval = +getEnvVar('SESSION_RENEW_INTERVAL')

// Session max age in ms
export const sessionMaxAge = +getEnvVar('SESSION_MAX_AGE')

// For Redis TTL
const sessionTTL = sessionMaxAge / 1000

const isProd = process.env.NODE_ENV === 'production'

export const sessionCookieOptions: CookieOptions = {
  maxAge: sessionMaxAge,
  httpOnly: isProd,
  secure: isProd,
  sameSite: isProd ? 'strict' : 'none'
}

export type SessionType = 'STAFF' | 'ADMIN_BASIC' | 'ADMIN_FULL'

export interface BaseSessionData {
  userId: string
  iat: number
}

export interface CustomSessionData {
  type: SessionType
}

export type SessionData = BaseSessionData & CustomSessionData

export interface Session {
  id: string
  data: SessionData
}

export class SessionService {
  private session?: Session

  private constructor(private req: Request, private res: Response) {}

  static async build(req: Request, res: Response): Promise<SessionService> {
    const instance = new SessionService(req, res)

    instance.initSession()

    return instance
  }

  /** Gets the current session. DO NOT modify this. */
  getSession(): Session | undefined {
    return this.session
  }

  /**
   * Only prepares user session expire. This should be called per user sign up.
   * Otherwise, session will throw error if user not registered.
   * This prevents potential tampering that causes random user creation.
   * */
  async signup(userId: string): Promise<void> {
    await this.redisResetUserExpire(userId)
  }

  /**
   * Creates a session in Redis and add required cookies for authentication.
   * Only creates if there's no session in the request.
   */
  async login(data: PartialBy<SessionData, 'iat'>): Promise<void> {
    if (this.session != null) {
      throw new ForbiddenError('Cannot login because session already exists')
    }

    const sessionId = nanoid(sessionIdLength)
    const newData = { ...data, iat: Date.now() }

    await this.redisSetSession(sessionId, newData)

    this.setSessionCookie(sessionId)
  }

  /** Deletes session in Redis and deletes session cookie */
  async logout(): Promise<void> {
    if (this.session == null) {
      throw new ForbiddenError('Cannot logout because there is no session')
    }

    await this.redisDeleteSession(this.session.id)
    this.deleteSessionCookie(this.session.id)
  }

  /** Logs user out of all sessions */
  async logoutAll(userId: string): Promise<void> {
    await this.redisResetUserExpire(userId)
  }

  /** Gets the current session, run only on init */
  private async initSession(): Promise<void> {
    const sessionId = this.req.cookies[sessionCookieName]
    const sessionData = sessionId && (await this.redisGetSession(sessionId))
    const userExpire =
      sessionData && (await this.redisGetUserExpire(sessionData.userId))

    if (sessionId == null || sessionData == null || userExpire == null) {
      return
    }

    // If issue date less than user min expire time
    if (sessionData.iat < userExpire) {
      return
    }

    // Renew session check
    if (Date.now() - sessionData.iat > renewSessionInterval) {
      // Set new max age
      const newData = { ...sessionData, maxAge: sessionMaxAge }

      await this.redisSetSession(sessionId, newData)

      // Re-set session cookie, consequently re-setting new max age
      this.setSessionCookie(sessionId)
    }

    // Set session here. Nowhere else should modify this
    // (Caveat of non-async constructor)
    this.session = {
      id: sessionId,
      data: sessionData
    }
  }

  //#region Redis

  private async redisGetSession(
    sessionId: string
  ): Promise<SessionData | undefined> {
    const key = this.getSessionKey(sessionId)

    const result = await redis.get(key)

    if (result != null) {
      return JSON.parse(result) as SessionData
    }

    return undefined
  }

  private async redisSetSession(
    sessionId: string,
    data: SessionData
  ): Promise<void> {
    const key = this.getSessionKey(sessionId)
    const value = JSON.stringify(data)

    await redis.setex(key, sessionTTL, value)
  }

  private async redisDeleteSession(sessionId: string): Promise<void> {
    const key = this.getSessionKey(sessionId)

    await redis.del(key)
  }

  private async redisGetUserExpire(userId: string): Promise<number> {
    const key = this.getExpireKey(userId)
    const expire = await redis.get(key)

    // If user has no expire key, throw error
    // Expire should be set on new user
    if (expire == null) {
      throw new Error('No expire key for user with id: ' + userId)
    }

    return +expire
  }

  private async redisResetUserExpire(userId: string): Promise<void> {
    const key = this.getExpireKey(userId)

    await redis.set(key, Date.now())
  }

  //#endregion

  //#region Cookies

  // Triggered by login and init renewal
  private setSessionCookie(sessionId: string) {
    this.res.cookie(sessionCookieName, sessionId, sessionCookieOptions)
  }

  // Triggered by logout
  private deleteSessionCookie(sessionId: string) {
    const cookieOptions = { ...sessionCookieOptions }
    cookieOptions.maxAge = undefined
    cookieOptions.expires = new Date(0)

    // Clear incase set by init renewal
    this.res.clearCookie(sessionCookieName)
    this.res.cookie(sessionCookieName, sessionId, cookieOptions)
  }

  //#endregion

  //#region Utilities

  private getExpireKey(userId: string) {
    return expireKeyPrefix + userId
  }

  private getSessionKey(sessionId: string) {
    return sessionKeyPrefix + sessionId
  }

  //#endregion
}
