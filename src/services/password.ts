import { hash, verify } from 'argon2'

export function hashPassword(password: string) {
  return hash(password)
}

export function verifyPassword(hash: string, password: string) {
  return verify(hash, password)
}
