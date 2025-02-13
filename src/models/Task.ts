import { JSONSchema } from 'objection'
import { BaseModel } from './BaseModel'

export enum TaskType {
  Service = 'SERVICE',
  Complaint = 'COMPLAINT',
  Delivery = 'DELIVERY',
  Transport = 'TRANSPORT',
  Others = 'OTHERS'
}

export class Task extends BaseModel {
  type!: TaskType
  remarks!: string
  done!: boolean

  jobId!: string

  static tableName = 'Task'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['type', 'remarks', 'jobId'],
    properties: {
      type: { type: 'string', enum: Object.values(TaskType) },
      remarks: { type: 'string' },
      done: { type: 'boolean' },
      jobId: { type: 'string' }
    }
  }
}
