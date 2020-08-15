import { nanoid } from 'nanoid/non-secure'

const resetTokenMap = new Map<string, string>()

export const mockHashPassword = jest.fn((password: string) => password)

export const mockVerifyPassword = jest.fn((hash: string, password: string) => {
  return hash === password
})

export const mockGenerateResetToken = jest.fn((userId: string) => {
  const resetToken = nanoid()
  resetTokenMap.set(resetToken, userId)
  return resetToken
})

export const mockCheckResetToken = jest.fn((resetToken: string) => {
  return resetTokenMap.get(resetToken)
})

export const mockDeleteResetToken = jest.fn((resetToken: string) => {
  return resetTokenMap.delete(resetToken)
})

export const PasswordService = jest.fn(() => ({
  hashPassword: mockHashPassword,
  verifyPassword: mockVerifyPassword,
  generateResetToken: mockGenerateResetToken,
  checkResetToken: mockCheckResetToken,
  deleteResetToken: mockDeleteResetToken
}))
