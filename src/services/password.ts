import { hash, verify } from 'argon2'

export class PasswordService {
  hashPassword(password: string) {
    return hash(password)
  }

  verifyPassword(hash: string, password: string) {
    return verify(hash, password)
  }
}
