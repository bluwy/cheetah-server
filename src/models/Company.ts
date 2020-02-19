import { JSONSchema } from 'objection'
import { BaseModel } from './BaseModel'

export class Company extends BaseModel {
  name!: string
  alias!: string

  static tableName = 'Company'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['name', 'alias'],
    properties: {
      name: { type: 'string' },
      alias: { type: 'string' }
    }
  }
}
