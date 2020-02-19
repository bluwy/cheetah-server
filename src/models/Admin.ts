import { JSONSchema } from 'objection'
import { BaseModel } from './BaseModel'

export const adminPrivileges = ['BASIC', 'FULL'] as const
export type AdminPrivilege = typeof adminPrivileges[number]

export class Admin extends BaseModel {
  username!: string
  hash!: string
  privilege!: AdminPrivilege

  static tableName = 'Admin'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['username', 'hash', 'privilege'],
    properties: {
      username: { type: 'string' },
      hash: { type: 'string' },
      privilege: { type: 'string', enum: adminPrivileges as any }
    }
  }
}
