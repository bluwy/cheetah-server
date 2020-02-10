import { hash, verify } from 'argon2'
import nanoid from 'nanoid'
import { redis } from './redis'

export class PasswordService {
  readonly resetTokenKeyPrefix = 'reset:'
  // Reset token time-to-live in seconds
  readonly resetTokenTTL = 1 * 60 * 60 // 1 hour

  /** Hashes the password using Argon2i */
  async hashPassword(password: string): Promise<string> {
    return hash(password)
  }

  /** Verifies the password using Argon2i */
  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return verify(hash, password)
  }

  /** Generate a reset token and save to Redis, returns the reset token */
  async generateResetToken(userId: string): Promise<string> {
    const resetToken = nanoid()
    const key = this.getResetTokenKey(resetToken)

    await redis.setex(key, this.resetTokenTTL, userId)

    return resetToken
  }

  /** Tries get reset token in Redis, returns userId if found, else undefined */
  async checkResetToken(resetToken: string): Promise<string | undefined> {
    const key = this.getResetTokenKey(resetToken)

    const userId = await redis.get(key)

    // userId if none returns null, not undefined, so "cast" it
    if (userId == null) {
      return undefined
    }

    return userId
  }

  private getResetTokenKey(resetToken: string) {
    return this.resetTokenKeyPrefix + resetToken
  }
}
