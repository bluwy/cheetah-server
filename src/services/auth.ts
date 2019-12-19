import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET ?? '' as jwt.Secret
export const staffLoginDuration = '810h'
export const adminLoginDuration = '810h'
export const adminForgotDuration = '2d'

export enum UserRole {
  Staff = 'STAFF',
  Admin = 'ADMIN'
}

export enum AdminPrivilege {
  Full = 'FULL',
  Basic = 'BASIC'
}

export interface StaffPayload {
  readonly role: UserRole.Staff
  readonly id: string
}

export interface AdminPayload {
  readonly role: UserRole.Admin
  readonly id: string
  readonly privilege: AdminPrivilege
}

export interface AdminForgotPasswordPayload {
  readonly id: string
}

export const isStaffPayload = (obj: object): obj is StaffPayload => {
  return 'role' in obj && (obj as { role: UserRole }).role === UserRole.Staff
}

export const isAdminPayload = (obj: object): obj is AdminPayload => {
  return 'role' in obj && (obj as { role: UserRole }).role === UserRole.Admin
}

export const isForgotAdminPayload = (obj: object): obj is AdminForgotPasswordPayload => {
  return 'id' in obj
}

export class UserContext {
  readonly role?: UserRole
  readonly privilege?: AdminPrivilege

  constructor (obj?: object) {
    if (obj != null) {
      if (isStaffPayload(obj)) {
        this.role = obj.role
      } else if (isAdminPayload(obj)) {
        this.role = obj.role
        this.privilege = obj.privilege
      }
    }
  }

  isVerified (): boolean {
    return this.role != null
  }

  isStaff (): boolean {
    return this.isVerified() && this.role === UserRole.Staff
  }

  isAdmin (): boolean {
    return this.isVerified() && this.role === UserRole.Admin
  }

  isAdminBasic (): boolean {
    return this.isAdmin() && this.privilege === AdminPrivilege.Basic
  }

  isAdminFull (): boolean {
    return this.isAdmin() && this.privilege === AdminPrivilege.Full
  }
}

export const signJwt = async (payload: string | object | Buffer, options: jwt.SignOptions = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, enc) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(enc)
      }
    })
  })
}

export const verifyJwt = async (token: string, options?: jwt.VerifyOptions): Promise<string | object> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (err, dec) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(dec)
      }
    })
  })
}

export const hashPassword = async (password: string): Promise<string> => argon2.hash(password)

export const verifyPassword = async (hash: string, password: string): Promise<boolean> => argon2.verify(hash, password)
