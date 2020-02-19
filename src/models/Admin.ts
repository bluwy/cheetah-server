import { BaseModel } from './BaseModel'

export const adminPrivileges = ['BASIC', 'FULL'] as const
export type AdminPrivilege = typeof adminPrivileges[number]

export class Admin extends BaseModel {
  username!: string
  hash!: string
  privilege!: AdminPrivilege

  static tableName = 'Admin'
}
