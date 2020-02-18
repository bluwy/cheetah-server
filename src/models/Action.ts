import { JSONSchema } from 'objection'
import { BaseModel } from './BaseModel'

export class Action extends BaseModel {
  remarks!: string

  static tableName = 'Action'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['remarks'],
    properties: {
      remarks: { type: 'string' }
    }
  }
}
