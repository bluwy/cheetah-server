import { JSONSchema } from 'objection'
import { BaseModel } from './BaseModel'

export class Staff extends BaseModel {
  username!: string
  fullName!: string
  deviceId!: string | null
  active!: boolean

  static tableName = 'Admin'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['username', 'fullName', 'active'],
    properties: {
      username: { type: 'string' },
      fullName: { type: 'string' },
      deviceId: { type: ['string', 'null'] },
      active: { type: 'boolean' }
    }
  }
}
