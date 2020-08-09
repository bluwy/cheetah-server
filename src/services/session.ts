import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { CookieOptions, Request, Response } from 'express'
import nanoid from 'nanoid'
import { redis } from '../redis'
import { getEnvVar } from '../utils/common'
import { PartialBy } from '../utils/types'

export const SESSION_ID_LENGTH = +getEnvVar('SESSION_ID_LENGTH')
export const SESSION_COOKIE_NAME = getEnvVar('SESSION_COOKIE_NAME')
export const EXPIRE_KEY_PREFIX = getEnvVar('SESSION_EXPIRE_KEY_PREFIX')
export const SESSION_KEY_PREFIX = getEnvVar('SESSION_SESSION_KEY_PREFIX')

// Everytime a session is active, renew it only between each interval in ms
export const RENEW_SESSION_INTERVAL = +getEnvVar('SESSION_RENEW_INTERVAL')

// Session max age in ms
export const SESSION_MAX_AGE = +getEnvVar('SESSION_MAX_AGE')

// For Redis TTL
const sessionTTL = SESSION_MAX_AGE / 1000

export const sessionCookieOptions: CookieOptions = {
  maxAge: SESSION_MAX_AGE,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
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

  constructor(private req: Request, private res: Response) {}

  /** Initialize session data. Must be called manually after instantiation */
  async init() {
    const sessionId = this.req.cookies[SESSION_COOKIE_NAME]
    const sessionData = sessionId && (await this.redisGetSession(sessionId))
    const userExpire =
      sessionData && (await this.redisGetUserExpire(sessionData.userId))

    if (sessionId == null || sessionData == null || userExpire == null) {
      return
    }

    // If issue date less than user expire time. The expire time is the baseline
    // where anything before it is assumed expired.
    if (sessionData.iat < userExpire) {
      // Revoke session (logout)
      await this.redisDeleteSession(sessionId)
      this.deleteSessionCookie(sessionId)
      return
    }

    // Renew session check
    if (Date.now() - sessionData.iat > RENEW_SESSION_INTERVAL) {
      // Reset issue date
      const newData = { ...sessionData, iat: Date.now() }

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

  /** Gets the current session. DO NOT modify this. */
  getSession(): Session | undefined
  getSession(force: true): Session
  getSession(force: false): Session | undefined
  getSession(force?: boolean): Session | undefined {
    if (force && this.session == null) {
      throw new AuthenticationError('Session not authenticated')
    }

    return this.session
  }

  /**
   * Creates a session in Redis and add required cookies for authentication.
   * Only creates if there's no session in the request.
   */
  async login(data: PartialBy<SessionData, 'iat'>) {
    if (this.session != null) {
      throw new ForbiddenError('Cannot login because session already exists')
    }

    const sessionId = nanoid(SESSION_ID_LENGTH)
    const newData = { ...data, iat: Date.now() }

    await this.redisSetSession(sessionId, newData)

    this.setSessionCookie(sessionId)
  }

  /** Deletes session in Redis and deletes session cookie */
  async logout() {
    if (this.session == null) {
      throw new ForbiddenError('Cannot logout because there is no session')
    }

    await this.redisDeleteSession(this.session.id)
    this.deleteSessionCookie(this.session.id)
  }

  /** Logs user out of all sessions */
  async logoutAll(userId: string) {
    await this.redisResetUserExpire(userId)
  }

  //#region Redis

  private async redisGetSession(sessionId: string) {
    const key = this.getSessionKey(sessionId)

    const result = await redis.get(key)

    if (result != null) {
      return JSON.parse(result) as SessionData
    }

    return undefined
  }

  private async redisSetSession(sessionId: string, data: SessionData) {
    const key = this.getSessionKey(sessionId)
    const value = JSON.stringify(data)

    await redis.setex(key, sessionTTL, value)
  }

  private async redisDeleteSession(sessionId: string) {
    const key = this.getSessionKey(sessionId)

    await redis.del(key)
  }

  private async redisGetUserExpire(userId: string) {
    const key = this.getExpireKey(userId)
    const expire = await redis.get(key)

    // Initialize key if null. Usually on first login
    if (expire == null) {
      this.redisResetUserExpire(userId)
      return Date.now()
    }

    return +expire
  }

  private async redisResetUserExpire(userId: string) {
    const key = this.getExpireKey(userId)

    await redis.set(key, Date.now())
  }

  //#endregion

  //#region Cookies

  // Triggered by login and init renewal
  private setSessionCookie(sessionId: string) {
    this.res.cookie(SESSION_COOKIE_NAME, sessionId, sessionCookieOptions)
  }

  // Triggered by logout
  private deleteSessionCookie(sessionId: string) {
    const cookieOptions = { ...sessionCookieOptions, maxAge: 0 }

    // Clear incase set by init renewal
    this.res.clearCookie(SESSION_COOKIE_NAME)
    this.res.cookie(SESSION_COOKIE_NAME, sessionId, cookieOptions)
  }

  //#endregion

  //#region Utilities

  private getExpireKey(userId: string) {
    return EXPIRE_KEY_PREFIX + userId
  }

  private getSessionKey(sessionId: string) {
    return SESSION_KEY_PREFIX + sessionId
  }

  //#endregion
}
