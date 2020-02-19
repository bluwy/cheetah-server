import { JSONSchema } from 'objection'
import { BaseModel } from './BaseModel'

export class Action extends BaseModel {
  remarks!: string

  assignmentId!: string

  static tableName = 'Action'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['remarks', 'assignmentId'],
    properties: {
      remarks: { type: 'string' },
      assignmentId: { type: 'string' }
    }
  }
}
