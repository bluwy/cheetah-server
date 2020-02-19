import { BaseModel } from './BaseModel'

export class Staff extends BaseModel {
  username!: string
  fullName!: string
  deviceId!: string | null
  active!: boolean

  static tableName = 'Admin'
}
