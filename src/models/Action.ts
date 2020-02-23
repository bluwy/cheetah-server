import { JSONSchema } from 'objection'
import { BaseModel } from './BaseModel'

export class Action extends BaseModel {
  remarks!: string

  jobId!: string

  static tableName = 'Action'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['remarks', 'jobId'],
    properties: {
      remarks: { type: 'string' },
      jobId: { type: 'string' }
    }
  }
}
