import { hash, verify } from 'argon2'
import nanoid from 'nanoid'
import { redis } from './redis'
import { getEnvVar } from '../utils/common'

export const resetTokenKeyPrefix = getEnvVar('RESET_TOKEN_KEY_PREFIX')

// Reset token time-to-live in seconds
export const resetTokenTTL = +getEnvVar('RESET_TOKEN_TTL')

export class PasswordService {
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

    await redis.setex(key, resetTokenTTL, userId)

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

  /** Deletes a reset token in Redis, typically called after `checkResetToken` valid */
  async deleteResetToken(resetToken: string): Promise<boolean> {
    const key = this.getResetTokenKey(resetToken)

    const deleteCount = await redis.del(key)

    return deleteCount > 0
  }

  private getResetTokenKey(resetToken: string) {
    return resetTokenKeyPrefix + resetToken
  }
}
