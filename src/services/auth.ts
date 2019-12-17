import { Secret, sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken'

const secret = process.env.JWT_SECRET ?? '' as Secret

export enum UserRole {
  Staff = 'STAFF',
  Admin = 'ADMiN'
}

export enum AdminPrivilege {
  Full = 'FULL',
  Basic = 'BASIC'
}

export interface UserPayload {
  readonly role: UserRole;
  readonly id: string;
}

export class StaffPayload implements UserPayload {
  readonly role: UserRole = UserRole.Staff
  readonly id: string

  constructor (id: string) {
    this.id = id
  }
}

export class AdminPayload implements UserPayload {
  readonly role: UserRole = UserRole.Admin
  readonly id: string
  readonly privilege: AdminPrivilege

  constructor (id: string, privilege: AdminPrivilege) {
    this.id = id
    this.privilege = privilege
  }
}

export const isPayloadUser = (obj: object): obj is UserPayload => {
  return ['role', 'id'].every(v => v in obj)
}

export const isPayloadStaff = (payload: UserPayload): payload is StaffPayload => {
  return payload.role === UserRole.Staff
}

export const isPayloadAdmin = (payload: UserPayload): payload is AdminPayload => {
  return payload.role === UserRole.Admin
}

export class UserContext {
  readonly role?: UserRole
  readonly privilege?: AdminPrivilege

  constructor (userPayload?: UserPayload) {
    if (userPayload != null) {
      this.role = userPayload.role
  
      if (isPayloadAdmin(userPayload)) {
        this.privilege = userPayload.privilege
      }
    }
  }

  isVerified (): boolean {
    return !!this.role
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

export const signJwt = (payload: string | object | Buffer, options: SignOptions = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    sign(payload, secret, options, (err, enc) => {
      if (err) {
        reject(err)
      } else {
        resolve(enc)
      }
    })
  })
}

export const verifyJwt = (token: string, options?: VerifyOptions): Promise<string | object> => {
  return new Promise((resolve, reject) => {
    verify(token, secret, options, (err, dec) => {
      if (err) {
        reject(err)
      } else {
        resolve(dec)
      }
    })
  })
}
